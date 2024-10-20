
### Inspiration
In the U.S., homelessness continues to be a persistent issue, affecting more than 650,000 individuals in 2023 alone. However, despite the lack of stable housing, many people experiencing homelessness own mobile phones. Research indicates that as many as **94% of homeless individuals** have access to a cellphone, with around **70%** having smartphones. This is crucial because phones act as a lifeline for communication, health services, and access to support networks. Phones help users connect with essential services like medical care, job opportunities, and safety alerts. Unfortunately, barriers such as maintaining a charge or affording phone plans remain common issues for this population.

With Echocare, we aim to leverage this prevalent mobile access to provide essential services in a more accessible, intuitive manner—bridging the gap between individuals in need and the care resources they seek.

### What it Does
Echocare is an intuitive platform designed to assist users in locating and connecting with nearby care services, such as medical centers, pharmacies, or home care providers. The application uses voice input, interactive maps, and real-time search functionalities to help users find the services they need quickly and seamlessly. With user-friendly navigation and smart recommendations, Echocare empowers people to get help with minimal effort.

### How We Built It

- **Next.js** for server-side rendering and static generation.
- **React** to build interactive and modular UI components.
- **TypeScript** for type safety and better developer experience.
- **Tailwind CSS** for rapid, utility-first styling of the application.
- **Framer Motion** for smooth and declarative animations.
- **GSAP (GreenSock Animation Platform)** for high-performance animations.
- **Three.js** for creating 3D graphics in the browser, adding depth and interactivity.
- **Vercel Postgres** for handling serverless SQL database queries efficiently.
- **Neon Database**, another serverless PostgreSQL option, for robust backend storage.
- **Clerk** to implement secure and seamless user authentication.
- **Google Maps API** to power the mapping functionality and location services.
- **Google Places API** for autocomplete suggestions and retrieving detailed place information.
- **Ant Design** for building out accessible and polished UI components.
- **Axios** for making API requests to external services easily.
- **Lucide React** for lightweight and customizable SVG icons.
- **Radix UI** to maintain unstyled, accessible UI primitives.
- **Vapi.ai** for integrating voice input and voice commands into the app.
- **Google Generative AI** to potentially assist with generating user-facing responses.
- **clsx**, **lib-utils-ts**, and **tailwind-merge** for additional utilities and styling functions.

### Challenges We Ran Into
From handling real-time data and geolocation services to integrating animations and voice input, we faced a number of technical hurdles:

- Optimizing database queries to handle both Vercel Postgres and Neon Database efficiently.
- Ensuring secure, yet intuitive, user authentication with Clerk.
- Combining various APIs and libraries without sacrificing performance or user experience.

### Accomplishments We Are Proud Of
- Seamlessly integrating voice input and location-based services.
- Building a visually engaging app using **Three.js** and **Framer Motion** for smooth transitions.
- Creating an application that’s both fast and responsive, thanks to **Next.js** and **TypeScript**.
- Successfully implementing secure and user-friendly authentication.

### What We Learned
- Balancing complexity with usability is key to creating a seamless experience.
- Integration of multiple APIs, especially for real-time data, requires careful planning.
- Learned how to optimize performance while delivering rich animations and interactions.
- Gained a deeper understanding of how to implement voice capabilities using **Vapi.ai**.

### Contributors
- **Rishit Das**  
- **Sujash Barman**
