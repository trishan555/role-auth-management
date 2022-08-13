
## Introduction
WasToWill Web application

Used Technology stack: NodeJS, ExpressJS , ReactJS, MongoDB

***

## Briefly explain about application

User roles : There are two roles available as Admin and User(Student)

Fuctionality :

Important : When you create student make sure use valid email address as student email. Because
email address will receive Temporary password and Verifing Link.

Initial page will be login page and first have to loggin to the system as an Admin.
Seeder file in backend root folder. It's includes admin and dummy verified student as well.
Admin can create users, view user details and search user by name, email or id and delete specific user.
When Admin create user by giving necessary details, user(student) receive verification email from application.
That email include temporary password and without verifing email, user cannot access 
the application even using Temporary password.
For verify, user have to click verifying link. That link include emailToken randomly genarate by application. 
Once emailToken only similar to token that store in database, account will verify.  
After clicking verify link in email user account will activating and then redirect to the login page.
Then user can use temporary password to login to the system. (Without verifing email user cannot access)

Students can update their profiles, add notes, view nottes, update notes and delete notes.

This app implemented by using JWT token base authentication and token save in frontend using cookie.

All routes are protected.
***

## Run application

1.	Clone the Repository.
2.	Go to backend folder ``` cd backend ```
3.	Run ``` npm install ```
4.	Run ``` node seeder.js ```
3.	Run ``` npm start ``` Server will be run on port:8000

While running server,
4.  Go to frontend folder ``` cd frontend ```
5.	Run ``` npm install ```
6.	Run ``` npm start ``` App will be open on port:3000 with login screen

Using following credencials login to the system and create the users.
Email- admin@gmail.com
Password - admin123

In case I added verified student as well in seeder.js file.
Verified student Email - student@gmail.com
Password - student123 



## Thank You!



