# M² Registration API Demo

This project is a **demo application** designed to help **third-party services** integrate with the **M² registration system**. It provides API endpoints to **add new users** when they register for M2 events.

## Overview
The API allows external services (such as club websites) to **search for existing users** and **add new users** to an event if they do not already exist.

---
## Authentication

All API calls require **authentication using an Auth0 token**.

### **Get an Auth0 Token**
To authenticate, request a token from:
POST https://meyer-squared.us.auth0.com/oauth/token
#### **Request Body**
```json
{
  "client_id": "<M2M_CLIENT_ID>",
  "client_secret": "<M2M_CLIENT_SECRET>",
  "audience": "https://meyersquared.com",
  "grant_type": "client_credentials"
}
```
#### **Response Body**
```
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "expires_in": 86400,
  "token_type": "Bearer"
}
```

Once obtained, this token must be included in the Authorization header for all API requests:
Authorization: Bearer <ACCESS_TOKEN>

### **Look Up a Person by Email**
Before registering a user, you should check if they already exist in the system.

```
GET /api/v1/person/email/{email}
```

### **Example Request**
```
GET https://meyer-squared-95db07154bdc.herokuapp.com/api/v1/person/email/test@test.com
```
### Response (User Exists)
```
{
"PersonId": 1,
"Email": "test@test.com",
"DisplayName": "Bob Smith",
"Pronouns": "He/Him",
"FirstName": "Robert",
"LastName": "Smith",
"ClubId": 10
}
```

### **Response (User Not Found)**
```
{
"message": "Person not found."
}
```
If a user is not found, the third-party system should prompt for first name, last name, and club details before creating a new person.

Email, DisplayName, FirstName and LastName are required fields.
ClubId is optional but recommended. It will default to "No Club" if not provided.
Pronouns are optional. They will default to "He/Him" if not provided.


#### **Add a New Person to an Event**
Once you have the person's information, either as an existing user or a new one, they can be registered for an event.

```
POST /api/v1/event/{eventId}/addNewPerson
```

### **Example Request**
```
POST https://meyer-squared-95db07154bdc.herokuapp.com/api/v1/event/5/addNewPerson
```

### **Request Body**
```
{
"PersonId": 0, // If new, otherwise use the ID from lookup
"Email": "Test@gmail.com",
"DisplayName": "Bob Smith",
"Pronouns": "He/Him",
"FirstName": "Robert",
"LastName": "Smoth",
"ClubId": 17 // ID from getAllClubs lookup. 
}
```

### **Response (Success)**
```
{
    "message": "Person added to event successfully"
}
```

### **Error Handling**
The API returns standard HTTP status codes for errors.

Status Code	Meaning
400 Bad Request	Missing or invalid parameters
401 Unauthorized	Invalid or missing Auth0 token
404 Not Found	Person or Event does not exist
400 Bad Request	Missing or invalid parameters
500 Internal Server Error	Server-side issue


### **Integration Steps for Third Parties**
Request an Auth0 token.
Check if the user exists using /api/v1/person/email/{email}.
If the user exists, register them for the event.
If the user does not exist, collect their first name, last name, and club, then create a new person before registering them.
Send the registration request using /api/v1/event/{eventId}/addPersonFromThirdParty.


### **Example Flow for a Club Website**
A fencer registers for an event on a third-party club website.
The club website calls the M2 API to check if the person exists.
If the person exists, the club adds them to the event.
If the person does not exist, the club website collects additional details, creates a new person, and then adds them to the event.
The M2 system confirms registration.

### **Ready to Integrate?**
If you need support or have any questions, contact M2 API Support.
📧 support@meyersquared.com


### **📌 What This README Includes**
✅ **Explains API Calls for Third Parties**  
✅ **Authentication & Token Handling**  
✅ **Step-by-Step Guide for Looking Up & Registering Users**  
✅ **Error Handling & Expected Responses**  
✅ **Integration Steps for External Services**
