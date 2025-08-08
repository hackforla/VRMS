# Python Virtual Environment

Welcome to the `scripts\python\env` folder of the VRMS backend. This folder contains a Jupyter notebook, dependencies for setting up the environment, and a `.gitignore` file for managing which files should be ignored by version control.

## Prerequisites

Before you begin, make sure you have Python installed on your machine. If you don't have Python installed yet, you can download and install it from the official website:

[Download Python](https://www.python.org/downloads/)

Once you have Python installed, you're ready to set up the virtual environment and install the necessary dependencies as described below.

## Requirements

Before you can run the Jupyter notebook, you will need to set up a Python virtual environment and install the required dependencies. Here's how you can do that:

### 1. Set Up a Python Virtual Environment

From within the `scripts` directory, run the following command to create a virtual environment:

```
python -m venv .
```

This will create a virtual environment within the current directory.

### 2. Activate the Virtual Environment

Once the virtual environment is created, you'll need to activate it.

- On **Windows**, run:
  
  ```
  .\Scripts\activate
  ```

- On **MacOS/Linux**, run:
  
  ```
  source bin/activate
  ```

### 3. Install Dependencies

With the virtual environment activated, you can now install the dependencies listed in `requirements.txt`:

```
pip install -r requirements.txt
```

### 4. Launch Jupyter Notebook

After installing the required dependencies, you can start the Jupyter notebook by running the following command:

```
jupyter notebook
```

This will open the Jupyter notebook interface in your web browser, where you can navigate to and run the script.

## .gitignore

The `.gitignore` file in this directory is set to ignore all files, including the virtual environment, so that unnecessary files don't get committed to version control. If you wish to track changes to new files added to this directory, you will need to use a command like:

```
git add -f .\backend\scripts\python\env\your-file.file
```

where -f forces git to add and begin tracking that file.