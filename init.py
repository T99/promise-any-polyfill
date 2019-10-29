#!/usr/bin/env python3.7

#   
#   Created by Trevor Sears <trevorsears.main@gmail.com>.
#   5:10 PM -- October 10th, 2019.
#   Project: js-module-template
#   

import json
import sys
import os
from os import path
from typing import List

sys.dont_write_bytecode = True

def find_and_replace_in_file(file_path: str, content: str, replacement: str) -> None:
	
	if path.exists(file_path) and path.isfile(file_path):
		
		lines: List[str] = []
		
		with open(file_path) as f:

			lines = f.readlines()
		
		lines = [line.replace(content, replacement) for line in lines]
		
		with open(file_path, "w") as f:
			
			f.writelines(lines)
		
	else:
		
		print("Could not find file in order to replace text.")
		
def set_if_empty(original: str, default: str) -> str:
	
	return original if original != "" else default

# Check whether or not this file is being run directly.
if __name__ == "__main__":
	
	# Attempt to read in the project initialization configuration file.
	CONFIG_FILE_PATH = "./init.config.json"

	if path.exists(CONFIG_FILE_PATH) and path.isfile(CONFIG_FILE_PATH):
		with open(CONFIG_FILE_PATH) as config_file:
			config = json.loads(config_file.read())

	else:
		print("Could not find the initialization config file ('init.config.json').")
		print("Exiting...")
		exit(1)

	# Calculate configuration options as needed.
	STRING_INDENT = " " * config["output-indentation"] if isinstance(config["output-indentation"], int) else str(
		config["output-indentation"])

	# Print start message.
	print("Running js-module-template initialization script...")

	# Prompt for relevant package information to find-and-replace template placeholder strings.
	package_name = input(STRING_INDENT + "Package name: ")
	package_version = input(STRING_INDENT + "Package version: (default: 0.1.0): ")
	package_desc_short = input(STRING_INDENT + "Short package description: ")
	package_desc_long = input(STRING_INDENT + "Long package description (defaults to short desc.): ")
	github_org = input(STRING_INDENT + "Github user/org (default: " + config["default-github-user-org"] + "): ")
	npm_org = input(STRING_INDENT + "NPM org (default: " + github_org + "): ")
	readme_title = input(STRING_INDENT + "README title (default: " + package_name + "): ")
	keywords = input(STRING_INDENT + "Package keywords (comma separated): ")
	keywords = [keyword.strip() for keyword in keywords.split(",")]
	
	print()
	
	# Set the default value for values not specified by the user.
	package_version = set_if_empty(package_version, "0.1.0")
	package_desc_long = set_if_empty(package_desc_long, package_desc_short)
	github_org = set_if_empty(github_org, config["default-github-user-org"])
	npm_org = set_if_empty(npm_org, github_org)
	readme_title = set_if_empty(readme_title, package_name)
	
	# Calculate compound values off of user input.
	package_name_full = package_name if npm_org == "" else "@" + npm_org + "/" + package_name

	# If the "delete-files" key exists and has items to delete...
	if "delete-files" in config and len(config["delete-files"]) > 0:
	
		# Delete the files specified in the config file.
		print(STRING_INDENT + "Deleting the specified project files...")
		
		for file in config["delete-files"]:
			print((STRING_INDENT * 2) + "--> " + path.relpath(file, "."), end="")
			if path.exists(file) and path.isfile(file):
				os.remove(file)
				print()
	
			else:
				print(" (failed: file not found)")
				
		print()
	
	# If the "move-files" key exists and has items to move...
	if "move-files" in config and len(config["move-files"]) > 0:
		
		# Move the files specified in the config file.
		print(STRING_INDENT + "Moving the specified project files...")
		
		for orig_name, new_name in config["move-files"]:
			print((STRING_INDENT * 2) + "--> " + path.relpath(orig_name, ".") + " to " + path.relpath(new_name, "."), end="")
			if path.exists(orig_name) and path.isfile(orig_name):
				os.replace(orig_name, new_name)
				print()
	
			else:
				print(" (failed: source file not found)")
				
		print()

	# If the "find-and-replace-files" key exists and has items to refactor...
	if "find-and-replace-files" in config and len(config["find-and-replace-files"]) > 0:
		
		# Perform a find-and-replace over the files specified in the config file.
		print(STRING_INDENT + "Finding-and-replacing information in the specified project files...")
		
		for file in config["find-and-replace-files"]:
			print((STRING_INDENT * 2) + "--> " + path.relpath(file, "."), end="")
			if path.exists(file) and path.isfile(file):
				find_and_replace_in_file(file, "<title>", readme_title)
				find_and_replace_in_file(file, "<name>", package_name_full)
				find_and_replace_in_file(file, "<base_name>", package_name)
				find_and_replace_in_file(file, "<version>", package_version)
				find_and_replace_in_file(file, "<desc>", package_desc_short)
				find_and_replace_in_file(file, "<desc_long>", package_desc_long)
				find_and_replace_in_file(file, "<github_org>", github_org)
				find_and_replace_in_file(file, "<npm_org>", npm_org)
				print()
				
			else:
				print(" (failed: file not found)")
				
		print()
		
	# Read in the package.json file and modify is according to the user's input.
	print("Configuring information in package.json...\n")
	
	with open("package.json", "r+") as npm_config:
		github_url = "https://github.com/" + github_org + "/" + package_name
		npm_config_json = json.loads(npm_config.read())
		npm_config_json["name"] = package_name_full
		npm_config_json["version"] = package_version
		npm_config_json["description"] = package_desc_short
		npm_config_json["repository"]["url"] = "git+" + github_url
		npm_config_json["keywords"] = keywords
		npm_config_json["bugs"]["url"] = github_url + "/issues"
		npm_config_json["homepage"] = github_url + "#readme"
		npm_config.seek(0)
		npm_config.write(json.dumps(npm_config_json, indent="\t"))
		npm_config.truncate()
		
	# Install the required packages from NPM.
	print(STRING_INDENT + "Installing packages from package.json...\n")
	os.system("npm install > /dev/null 2>&1")
	
	# If the initialization file is configured to delete itself on-completion, comply.
	print(STRING_INDENT + "Done! Exiting...\n")
	
	if config["self-destruct"]:
		os.remove(__file__)