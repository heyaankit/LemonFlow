This is my third attempt of understanding fastapi with the help of making projects. 
I will update it frequently every time when I find something new to learn in as a record for my personal log if needed in future.

Here - 
1. Learnt how to define a datetime datatype in SQL Model class.
2. Learnt how to implement ENUM in Model class. 
3. Learnt how to make a relationship between different Model class or different tables in database (fried my brain btw).
4. Learnt how to take any string with any datatype in basemodel from create schema.
5. Learnt 'Fields' today, that is imported from pydantic which will help me to create a metadata and take user response in a more customized and validated form. Use only if needed.
6. Learnt that PostgreSQL is far superior than MySQL and it's also open-source so i'm adopting to it today. Will make some changes in code from MySQL to PostgreSQL.
7. Okay, learnt that declarative base can also be initiated by importing registry, often called mapper_registry. I'll remember to use it from the next project.
8. Column() that is used to define models can be changed to newer version that is mapped_column for better and cleaner code. I'll also remember to use it from now onwards.
9. query() can also be replaced with select(). Will remember to use it from the next project.
10. Learnt that API function also have something called Query (imported with FastAPI). It lets me to force the user to send the correct data before even my code runs. Pretty useful i see. Use only if needed.
11. I haven't used inheritance but make sure to do that from the next project. Needs some practice there.
12. Okay, learnt that if there is any inconsistencies between PostgreSQL database schema and the database models in my model.py file... I'll face internal server error.
13. Also learnt that dropdown can be used for ENUMS, i don't have to match my string from the options when testing APIs. Will use in my next project.
14. Forms can also be used in replacement of Field. May use in my next project. 
15. Okay, when pushing any new project into a repositry, make sure that my database_url is inside env folder and alongside with env, make sure that other folders like cache and local dumps inside database are not tracked by version control. Use .gitignore there. Need to fix that mistake now. 
16. Learnt how to integrate github in my workflow and also learnt how to use Render, a cloud app deployment service. 
