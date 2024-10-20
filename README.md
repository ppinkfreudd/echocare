
### Inspiration
In the U.S. and S.F., homelessness continues to be a persistent issue, affecting more than 650,000 individuals in 2023 alone. Despite the lack of stable housing, many people experiencing homelessness own mobile phones. Research indicates that as many as **94% of homeless individuals** have access to a cellphone, with around **70%** having smartphones. This is crucial because phones act as a lifeline for communication, health services, and access to support networks. Phones help users connect with essential services like medical care, job opportunities, and safety alerts. Unfortunately, barriers such as maintaining a charge or affording phone plans remain common issues for this population.

In addition, U.S. faces a huge problem of food wastage. 150,000 tonnes of food are wasted each year JUST in SF.  

With Echocare, we aim to kill these 2 problems with 1 stone. We leverage S.O.T.A Artificial Intelligence to provide essential services to homeless people in a more accessible and intuitive manner. Additionally, we allow restaurants to donate and keep track of leftover food using an inventory tracker which can be used to feed the homeless people.   

### What it Does
Echocare is an intuitive platform designed to assist users in locating and connecting with nearby care services, such as medical centers, pharmacies, or home care providers. The application uses voice input, interactive maps, and real-time search functionalities to help users find the services they need quickly and seamlessly. With user-friendly navigation and smart recommendations, Echocare empowers people to get help with minimal effort. In addition, it offers a separate platform for restaurants to keep track of leftover food and donate them at the end of each business day to homeless people. 

### How We Built It

- **Next.js** for server-side rendering and static generation.
- **React** to build interactive and modular UI components for the front end.
- **TypeScript** for type safety and a robust backend.
- **Tailwind CSS** for rapid, utility-first styling of the application.
- **Framer Motion** for smooth and declarative animations.
- **GSAP (GreenSock Animation Platform)** for high-performance animations. (Used for Echo)
- **Three.js** for creating 3D graphics in the browser, adding depth and interactivity. (Echo has 3d graphics built in it)
- **Vercel Postgres** to communicate with Neon DB (Serverless Postgres)
- **Neon Database** a serverless PostgreSQL option, for robust backend storage to store the donated food items of the restaurants. Uses minimal compute and is good for developing low-latency applications
- **Clerk** to implement secure and seamless user authentication for managers of the restaurants who want to donate food.
- **Google Maps API** to power the mapping functionality and location services (This was embedded with Echo to provide precise directions).
- **Google Places API** for autocomplete suggestions and retrieving detailed place information. 
- **Ant Design, Aceternity UI** for building the forms in the food donation page and having a clean look for the landing page (inspired by the multicolored and vibrant lights of SF in the night)  
- **Axios** for making API requests to external services easily (Google Maps and Places API)
- **Lucide React** for all of the icons used in the application.
- **Vapi.ai** For creating the one and only assistant
- **Google Gemini Flash 1.5** to potentially assist with generating user-facing responses.
- **Groq 3.1 70b versatile (fine-tuned)** to assist Vapi.ai with insights.
- **Cartesia** to provide hyper-realistic service for users.

### Challenges We Ran Into
We found it very difficult to transcribe the conversations between the user and Vapi.ai echo agent. Rishit had to code for 16 hours straight to get it working. We also found the Google Gemini Integration to be hard because the multimodal functionality wasn't easy to implement. Especially with Typescript which isn't well documented as compared to Python. Finally, stitching the backend and frontend together in the food donation page also took a lot of time to carry out.  

### Accomplishments We Are Proud Of
- Getting 4 sponsored tools to be seamlessly integrated in the application
- Using a grand total of 18 tools to build Echocare from the ground up
- Finishing the entire product 10 hours before the deadline
- Creating a product which can truly be used to help burdened communities thrive
- Having a lot of fun and enjoying the process of building Echocare!

### What We Learned
- Typescript - We have never used it to build a project before and through this hackathon, we gained understanding of how we can use it to build cohesive applications
- Vapi.AI - Using the dashboard and integrating custom APIs into Vapi was a tricky operation, but we toughed it out and made it work.
- NeonDB - We used this DB and learned basic SQL queries to insert and get data from the DB which we used to setup the donation page.
- Google Maps/Places API - Although they were relatively easy to implement, some time had to spent to initialize them.
- Groq, Cartesia - They were definitely tricky to implement with Vapi's dashboard.
- Gemini Integration with TS - Although it was < 100 lines of code, we kept running into errors. Turned out that Gemini Pro Vision was disabled and we had to use Gemini 1.5 Flash instead ;( 

### Contributors
- **Rishit Das**  
- **Sujash Barman**
