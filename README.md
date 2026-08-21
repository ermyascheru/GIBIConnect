# GIBI Connect

## Educational Information and AI Consultation Platform

### 1. Project Overview

**GIBI Connect** is a centralized educational technology platform designed to help students easily access educational information, academic resources, guidance, and AI-powered consultation services through a single digital platform.

The main purpose of GIBI Connect is to reduce the difficulty students face when searching for reliable educational information and making academic decisions. Students often need to search through different websites, social media platforms, institutional pages, and other sources to find information about educational opportunities, programs, academic resources, and career-related guidance. GIBI Connect aims to bring these services together in one organized and accessible system.

The platform will provide students with educational information while also using an **AI consultation system** to provide personalized guidance based on a student's questions, interests, academic situation, and goals. The system is intended to function as a digital educational companion that can help students understand available opportunities and make more informed academic decisions.

GIBI Connect will use a modern web architecture consisting of a **React + Vite frontend, Node.js and Express.js backend, PostgreSQL database, and AI-powered consultation system**. These components will work together to provide a secure, scalable, and user-friendly platform.

---

## 2. Problem Statement

Students face several challenges when trying to obtain educational information and guidance.

Educational information is often distributed across different platforms and sources. Information about universities, colleges, academic programs, scholarships, educational opportunities, and other resources may be difficult to find, outdated, or poorly organized.

Students may also have difficulty determining which educational path is appropriate for them. A student may have questions about their academic interests, possible career paths, available opportunities, or what skills they should develop. In many cases, students do not have immediate access to an academic advisor or counselor who can provide guidance.

Another challenge is that existing platforms may provide information without offering personalized interaction. Students may find information online but still need help understanding it and determining how it applies to their individual situation.

**GIBI Connect addresses these problems by combining centralized educational information with an AI-powered consultation system in one platform.**

---

## 3. Project Objectives

### General Objective

To develop a centralized educational information and AI consultation platform that provides students with accessible educational resources, personalized guidance, and useful academic information.

### Specific Objectives

The project aims to:

1. Develop a centralized platform for organizing and providing educational information.
2. Provide students with an easy-to-use interface for accessing educational resources.
3. Develop secure user registration and authentication.
4. Store and manage user and educational information using a PostgreSQL database.
5. Develop a backend API using Node.js and Express.js.
6. Integrate an AI consultation system capable of responding to students' educational questions.
7. Provide personalized academic guidance based on user-provided information.
8. Help students explore educational opportunities and make informed decisions.
9. Maintain organized and reliable educational data.
10. Develop the system using a modular architecture that can be expanded with additional features in the future.

---

## 4. Target Users

GIBI Connect is primarily intended for:

* **High school students** looking for information about higher education and future academic paths.
* **College and university students** looking for academic guidance and educational resources.
* **Students searching for scholarships and educational opportunities.**
* **Students seeking career and academic guidance.**
* **Educational institutions and administrators** who may provide or manage educational information.
* **Future educators and counselors** who may use the platform as an additional source of information and guidance.

---

## 5. Major Features

### 5.1 User Registration and Authentication

Users will be able to create accounts and securely log into the platform.

The authentication system will allow the application to:

* Register new users.
* Authenticate existing users.
* Secure user accounts.
* Manage user sessions.
* Control access to protected features.
* Manage different user roles where required.

---

### 5.2 Student Profile

Registered users will have a personal profile containing relevant information that can help personalize their experience.

Depending on the final implementation, a profile may contain information such as:

* Name
* Educational level
* Field of study
* Academic interests
* Skills
* Career interests
* Educational goals

This information can also be used by the AI consultation system to provide more relevant guidance.

---

### 5.3 Educational Information

The platform will organize educational information into categories so that users can find relevant information more easily.

Possible categories include:

* Universities
* Colleges
* Academic programs
* Departments
* Scholarships
* Training opportunities
* Educational resources
* Career information
* Skills development
* Admission information

The information will be stored and managed through the backend and PostgreSQL database.

---

### 5.4 AI Consultation

One of the main features of GIBI Connect is the **AI consultation system**.

Students will be able to ask educational questions and receive AI-generated guidance.

For example, a student could ask:

> "I am interested in artificial intelligence. What skills should I learn?"

The AI system could provide information about programming, mathematics, machine learning, data structures, projects, and other relevant skills.

Students could also ask questions about:

* Academic choices
* Career paths
* Skills to learn
* Study strategies
* Educational opportunities
* Academic subjects
* Technology fields
* Career preparation
* Personal learning goals

The AI consultation system is intended to provide **guidance and educational assistance**, rather than replace professional academic counselors or official institutional information.

---

## 6. Database System

GIBI Connect will use **PostgreSQL** as its primary relational database.

The database will be responsible for storing and managing structured application information.

Potential database entities include:

* Users
* Student profiles
* Educational institutions
* Academic programs
* Scholarships
* Educational resources
* AI consultation history
* User preferences
* User roles

The database allows information to be stored persistently instead of relying on temporary application data.

The backend will communicate with PostgreSQL through appropriate database connections and queries.

---

## 7. Backend System

The backend will be developed using **Node.js and Express.js**.

The backend will act as the main communication layer between the frontend, database, authentication system, and AI services.

Its responsibilities will include:

* Handling API requests.
* Managing authentication.
* Validating user input.
* Communicating with PostgreSQL.
* Managing user accounts.
* Retrieving educational information.
* Storing relevant user information.
* Processing AI consultation requests.
* Returning responses to the frontend.
* Implementing security and authorization rules.

The backend will expose RESTful API endpoints that the frontend can use to communicate with the system.

---

## 8. Frontend System

The user interface will be developed using **React with Vite**, with **TypeScript and Tailwind CSS** used to create a structured and responsive interface.

The frontend will provide users with access to the platform's major features.

Possible pages include:

* Home page
* Registration page
* Login page
* Student dashboard
* User profile
* Educational information page
* Scholarship/opportunity page
* AI consultation page
* Resources page
* Administration pages

The interface will be designed to be simple and accessible so that students can navigate the system without requiring advanced technical knowledge.

---

## 9. System Architecture

GIBI Connect will follow a layered architecture.

The major components will be:

**User → React Frontend → Node.js/Express Backend → PostgreSQL Database**

The AI consultation system will also communicate through the backend so that sensitive operations and API credentials are not unnecessarily exposed to the frontend.

The architecture can therefore be represented conceptually as:

**Frontend**
→ React + Vite
→ TypeScript
→ Tailwind CSS

**Backend**
→ Node.js
→ Express.js
→ REST API
→ Authentication
→ Business Logic

**Data Layer**
→ PostgreSQL
→ Users
→ Educational Information
→ Profiles
→ Consultation Data

**AI Layer**
→ AI consultation service
→ Student questions
→ Context/personalization
→ AI-generated educational guidance

---

## 10. Security

Security will be an important part of the system.

The platform will implement appropriate security mechanisms such as:

* Secure authentication.
* Password hashing.
* Token-based authentication where appropriate.
* Input validation.
* Role-based authorization.
* Protected API endpoints.
* Secure database access.
* Environment variables for sensitive configuration.
* Protection of AI API credentials.
* Proper error handling.

The backend will be responsible for verifying authentication and authorization rather than trusting information provided directly by the frontend.

---

## 11. Expected Benefits

GIBI Connect is expected to provide several benefits to students and educational users.

### For Students

* Easier access to educational information.
* Centralized educational resources.
* Personalized AI guidance.
* Better understanding of academic and career options.
* Easier discovery of educational opportunities.
* A single platform for multiple educational needs.

### For Educational Information Management

* Organized storage of educational information.
* Easier management and updating of information.
* Structured database-based data management.
* Better integration between educational resources and digital services.

### For the Project Team

The project will also provide practical experience in:

* Full-stack web development.
* Database design.
* REST API development.
* Authentication and authorization.
* AI integration.
* Git and GitHub collaboration.
* Software architecture.
* Team-based software development.

---

## 12. Future Improvements

GIBI Connect can be expanded in the future with additional features such as:

* Mobile application support.
* Advanced AI personalization.
* Recommendation systems.
* University and program comparison.
* Scholarship recommendation.
* Career-path recommendations.
* Notifications and reminders.
* Educational institution dashboards.
* Analytics and reporting.
* Multilingual support.
* Integration with official educational information sources.
* Advanced search and filtering.
* AI-generated study plans.
* Student progress tracking.

---

# 13. Project Team

| No. | Full Name                        | Student ID           | Responsibility                   |
| --: | -------------------------------- | -------------------- | -------------------------------- |
|   1 |      Ermiyas Cheru               |     CTC-5723-26      |        Database and AI/RAG       |
Backend/API|   3 |      Ezra Michael     |     CTC-3205-26      |        UI/UX + Components        |
|   4 |      Ezana Girmay                |     CTC-7612-26      |        Frontend Pages            |
|   5 |      Elsabeth Berhanu            |     CTC-1036-26      |    Auth + Admin + Testing        |

### Team Members

**Member 1:**   Ermiyas Cheru
**Student ID:** CTC-5723-26

**Member 2:**   Fekadu Alemnew
**Student ID:** CTC-4438-26

**Member 3:**   Ezra Michael  
**Student ID:** CTC-3205-26   
**Member 4:** Ezana Girmay 
**Student ID:** CTC-7612-26 

**Member 5:** Elsabeth Berhanu 
**Student ID:** CTC-1036-26 

---

## 14. Conclusion

GIBI Connect is proposed as a centralized educational platform that combines educational information, student services, database management, and AI-powered consultation.

By bringing these capabilities together, the platform aims to make educational information easier to access while providing students with an interactive system that can assist them in understanding their academic and career-related options.

The combination of **React, Node.js, Express.js, PostgreSQL, and AI technologies** provides a strong technical foundation for developing the platform. The system can also be expanded in the future to support additional educational services and a larger number of users.

Ultimately, **GIBI Connect aims to become a digital educational companion that helps students find information, explore opportunities, receive guidance, and make better-informed decisions about their education and future.**

