# interview-task-boilerplate

## Setting up your environment vars
### Step 1.
You need to create a .env file in the root of the backend dir using this command:
```bash
cd backend
cp .env.example .env
```
### Step 2. 
a) Go to https://mailtrap.io/register/signup and sign up for a free account (I recommend using a fake email from https://temp-mail.org/en/) and accept their email confirmation. 

b) Log in and fill out the 4 questions they ask and then select "testing emails" and finish.

c) Finally when you're on the homepage click "Start testing"

d) On the following page copy the `Username` & `Password` fields to your .env file fields for `MAILTRAP_USER` & `MAILTRAP_PASS`

**IMPORTANT** Keep this tab open! You're going to need it to receive login email invites.

## Installing Dependencies & Create DB
### Step 3.
Navigate to the route of the backend directory in terminal:
```bash
cd backend # you're probably already here so skip
pnpm install
pnpm create_db
# if both of those ran, you can start the backend now with:
pnpm dev
```
Then open a new terminal and navigate to the route of the frontend directory in terminal:
```bash
cd frontend
pnpm install
# If that worked, you can start the frontend now with:
pnpm dev
```
Vite should auto open a tab for you in the browser and if everythings working you should see a page that says "Hey!". Open responsive design mode in your browsers dev tools and follow the instructions on screen!

## Creating a user and logging in
When you put in a name and email address into the dialog and press `SEND MAGIC LINK` we're going to "pretend" to get the email so we don't have to pay for mailtrap. You should see the emails come in to "my inbox" in mailtrap no matter what email you provided to the app eg: you can log in as george with george@example.com provided, the email will still come to you - very handy for dev testing!

If a user doesn't exist it will be created and auto-seeded with test transactions... and Jerry will ask them for money for that Earls lunch they had a while back.


### Challenge stuff
backend took about a .5 to .75 days scattered over a week or so

frontend & design took about 1.5 days scattered over a week or so