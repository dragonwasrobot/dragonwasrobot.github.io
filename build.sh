#!/bin/bash

echo "Running 'gem install jekyll bundler...'"
gem install jekyll bundler

echo "Running 'bundle install...'"
bundle install

echo "Running 'bundle exec jekyll build...'"
bundle exec jekyll build

echo "Run 'bundle exec jekyll serve --drafts' to start the blog web server"
