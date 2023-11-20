Frontend (React.js):

Members:

Project Member(PM): Handles adding projects, defining partial deliverables, and uploading demonstrative videos or links.
Student: Participates in the project and may be selected as a jury member.
Jury: Grading interface for jury members, showing projects due for evaluation.
Professor: Interface to view project evaluation results without seeing the jury identities. Gives final grade.

1.1  Communication with Backend:

Utilize the RESTful API provided by the backend.

1.2  Authentication: 

Secure user authentication and authorization mechanisms.
Login data is saved into a relational database like MySQL for further processing.




1.3 State Management:

Use state management libraries like Redux or React Context API to manage global application state.
Store user information, project data, and grades.


Backend (Node.js with Express):

2.1 RESTful API:

Define ways for managing users, projects, deliverables, grading, etc.
Implement authentication to validate user permissions.
Use Express.js for handling HTTP requests.

2.2 Database (MySQL with Sequelize ORM):

Define database models for users, projects, deliverables, grades, etc.
Sequelize ORM for interacting with the MySQL database.
Establish relationships between entities (e.g., a project has multiple deliverables, a user can be a project manager, permissions).

2.3 Business Logic:

Implement the business logic for project creation, grading, and result calculation.
Enforce rules like anonymous grading and limited periods for modifying the grade.
Authentication and Authorization:


3.Database (MySQL):

3.1 Schema:Define tables for users, projects, deliverables, grades, etc.
+relationships using foreign keys.

3.2 Constraints:Enforce constraints to maintain data integrity.
Ensure proper indexing for efficient data retrieval.


4.Version Control (Git):

4.1 Repository Structure well-organized repository structure.
Incremental commits with clear commit messages.

4.2:Branching Strategy: feature branches for better code management.

5.Documentation:

5.1 Code Comments: comments explaining the purpose and functionality of classes, functions, and important code blocks.

5.2 API Documentation: documentation of API endpoints, expected request/response formats, and authentication requirements.




6.Testing (Optional):

6.1 Unit Tests: unit tests for critical functions and components.
6.2 Integration Tests: interaction testing between frontend and backend components.

7.Additional Considerations:

7.1 Security: secure practices, such as input validation and protection against common web vulnerabilities. ( sql injections ) 

7.2 Error Handling:  robust error handling mechanisms for both frontend and backend.

7.3 Deployment: deploying the project on git
