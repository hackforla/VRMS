import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import EmailController from './email.controller.js';
import { CONFIG_AUTH } from '../config/index.js';

import { User, Project, RefreshToken } from '../models/index.js';
import {
  generateRefreshToken,
  getClientIp,
  hashToken,
  generateAccessToken,
} from '../middleware/auth.middleware.js';

const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

const UserController = {};

// Get list of Users with GET
UserController.user_list = async (req, res) => {
  const { headers } = req;
  const { query } = req;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.find(query);
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

UserController.user_by_email = async (req, res) => {
  const { headers } = req;
  const { email } = req.params;

  console.log('email: ', email);

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.find({ email });
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

// Get list of Users with accessLevel 'admin' or 'superadmin' with GET
UserController.admin_list = async (req, res) => {
  const { headers } = req;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const admins = await User.find({
      accessLevel: { $in: ['admin', 'superadmin'] },
    });
    return res.status(200).send(admins);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

UserController.projectManager_list = async (req, res) => {
  const { headers } = req;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const projectManagers = await User.find({
      managedProjects: { $exists: true, $type: 'array', $ne: [] },
    });

    // Collect all unique project IDs
    const allProjectIds = [
      ...new Set(
        projectManagers
          .flatMap((pm) => pm.managedProjects)
          .filter((id) => typeof id === 'string' && id.match(/^[a-f\d]{24}$/i)),
      ),
    ];

    // Fetch all projects in one query
    const projects = await Project.find(
      { _id: { $in: allProjectIds } },
      { _id: 1, name: 1 }, // projection
    );

    const projectIdToName = {};
    for (const project of projects) {
      projectIdToName[project._id.toString()] = project.name;
    }

    const updatedProjectManagers = projectManagers.map((pm) => {
      const pmObj = pm.toObject();
      pmObj.isProjectLead = true;
      pmObj.managedProjectNames = (pmObj.managedProjects || [])
        .map((pid) => projectIdToName[pid.toString()] || null)
        .filter(Boolean);
      return pmObj;
    });

    return res.status(200).send(updatedProjectManagers);
  } catch (err) {
    console.error(err);
    console.log('Projectlead error', err);
    return res.sendStatus(400);
  }
};

// Get User by id with GET
UserController.user_by_id = async (req, res) => {
  const { headers } = req;
  const { UserId } = req.params;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findById(UserId);
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

// Add User with POST
UserController.create = async (req, res) => {
  const { headers } = req;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const newUser = {
      ...req.body,
      email: req.body.email.toLowerCase(),
    };
    const user = await User.create(newUser);
    return res.status(201).send(user);
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(409).json({
        error,
        message: 'User already exists',
      });
    }
    return res.sendStatus(400);
  }
};

// Update User with PATCH
UserController.update = async (req, res) => {
  const { headers } = req;
  const { UserId } = req.params;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findOneAndUpdate({ _id: UserId }, req.body, {
      new: true,
    });
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

// Add User with POST
UserController.delete = async (req, res) => {
  const { headers } = req;
  const { UserId } = req.params;

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findByIdAndDelete(UserId);
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

UserController.createUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const { origin } = req.headers;

  const user = new User({
    name: {
      firstName,
      lastName,
    },
    email: email.toLowerCase(),
    accessLevel: 'user',
  });

  try {
    await user.save();
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
  }

  const jsonToken = generateAccessToken(user);

  EmailController.sendLoginLink(req.body.email, user.name.firstName, jsonToken, req.cookie, origin);
};

UserController.signin = (req, res) => {
  const { email, auth_origin } = req.body;
  const { origin } = req.headers;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }
      const jsonToken = generateAccessToken(user, auth_origin);
      EmailController.sendLoginLink(
        req.body.email,
        req.body.auth_origin,
        user.name.firstName,
        jsonToken,
        req.cookie,
        origin,
      );
      return res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);

      return res.status(400);
    });
};

UserController.verifySignIn = async (req, res) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  try {
    const payload = jwt.verify(token, CONFIG_AUTH.JWT_SECRET);
    const user = await User.findById(payload.id);
    const refreshToken = generateRefreshToken();
    const accessToken = generateAccessToken(user, payload.auth_origin);
    const ipAddress = getClientIp(req);

    await RefreshToken.create({
      userId: user._id,
      hash: hashToken(refreshToken),
      deviceInfo: {
        deviceType: req.headers['user-agent'],
        ipAddress: ipAddress,
      },
    });

    res.cookie('token', accessToken, { httpOnly: true });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });

    return res.send({
      user: user,
      expiresAt: accessToken.exp * 1000, // Convert JWT exp (seconds) to milliseconds
    });
  } catch (err) {
    console.error(err);
    return res.status(403);
  }
};

UserController.verifyMe = async (req, res) => res.status(200).send(req.user);

UserController.logout = async (req, res) => {
  try {
    await RefreshToken.deleteOne({ _id: req.refreshToken._id });
    return res.clearCookie('token').status(200).send('Successfully logged out.');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error occurred while logging out.');
  }
};

UserController.refreshAccessToken = async (req, res) => {
  const accessToken = generateAccessToken(req.user, req.auth_origin);
  const decoded = jwt.decode(accessToken);

  return res
    .cookie('token', accessToken, { httpOnly: true })
    .status(200)
    .json({
      user: req.user,
      expiresAt: decoded.exp * 1000, // Convert JWT exp (seconds) to milliseconds
    });
};

// Update user's managedProjects
UserController.updateManagedProjects = async (req, res) => {
  const { headers } = req;
  const { UserId } = req.params;
  const { action, projectId } = req.body; // action - 'add' or 'remove'

  if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findById(UserId);
    let managedProjects = user.managedProjects || [];

    const project = await Project.findById(projectId);
    let managedByUsers = project.managedByUsers || [];

    if (action === 'add') {
      managedProjects = [...managedProjects, projectId];
      managedByUsers = [...managedByUsers, UserId];
    } else {
      managedProjects = managedProjects.filter((id) => id !== projectId);
      managedByUsers = managedByUsers.filter((id) => id !== UserId);
    }

    user.managedProjects = managedProjects;
    await user.save({ validateBeforeSave: false });

    project.managedByUsers = managedByUsers;
    await project.save({ validateBeforeSave: false });

    return res.status(200).send({ user, project });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

UserController.bulkUpdateManagedProjects = async (req, res) => {
  const { bulkOps } = req.body;

  bulkOps.forEach((op) => {
    if (op?.updateOne?.filter._id) {
      op.updateOne.filter._id = new ObjectId(op.updateOne.filter._id);
    }
    if (op?.updateOne?.update) {
      const update = op.updateOne.update;
      if (update?.$addToSet?.managedProjects) {
        update.$addToSet.managedProjects = new ObjectId(update.$addToSet.managedProjects);
      }
      if (update?.$pull?.managedProjects) {
        update.$pull.managedProjects = new ObjectId(update.$pull.managedProjects);
      }
    }
  });

  try {
    const result = await User.bulkWrite(bulkOps);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = UserController;
