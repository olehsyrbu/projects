#!/bin/sh
# combine and encode login and password with base64
# usage: ./mindlogger-credentials.sh my@user.com my-secret-password

echo "$1:$2" | base64


