**FAQ API**

**Key Features**

- FAQ Retrieval: Fetch FAQs in different languages (default is English) with efficient cache handling using Redis.

- Cache Efficiency: Redis is used for caching FAQ data, reducing load on the database. The Redis client has an LRU (Least Recently Used) 
   implementation, ensuring that the most frequently used data remains in memory while older or infrequently accessed data is evicted.

- Parallel Translations: Translations are fetched concurrently for all FAQs using Promise.all(), significantly improving performance when handling multiple FAQs.

- MongoDB: MongoDB stores FAQs, with fields optimized for the required data (question, answer, translations). Translations are stored and 
  updated when they are missing.

- Swagger Documentation: The system exposes a Swagger UI to interact with the API endpoints. Accessible at http://localhost:3000/api-docs.

**Architecture Overview**
This system follows an MVC (Model-View-Controller) design pattern with the following components:

- Model: Represents the FAQ schema in MongoDB, storing questions, answers, and their respective translations for each language.

- View: This system uses RESTful API responses to interact with front-end applications, with no direct UI components in this backend.

- Controller: Handles the logic for fetching, creating, and managing FAQs. The getFAQs function checks Redis cache first, falls back to 
   MongoDB, and handles translations concurrently for missing translations. The createFAQ function handles adding new FAQs to the database.

- Cache Layer (Redis): Redis stores the FAQ data for each language with a 1-hour expiration time. It uses an LRU eviction policy, ensuring the 
  cache stays efficient and relevant.

**Efficiency Optimizations**

- Parallel Translations: The translation of questions and answers for multiple FAQs is handled in parallel using Promise.all(). This significantly reduces the time needed to translate multiple FAQs compared to sequentially translating them.

- Selective MongoDB Queries: The .select('question answer translations') method ensures that only the necessary fields (question, answer, and translations) are fetched from MongoDB, reducing data transfer overhead.

- Redis Cache with LRU: The Redis client is configured with an LRU eviction policy. This ensures that frequently accessed FAQs stay in memory, and older, less frequently accessed data is removed when the cache exceeds its memory limit. This approach makes the system highly efficient by serving frequently requested FAQs from cache, reducing the number of database queries.

**API Endpoints**

1. GET /api/faqs
Fetches the FAQs for the selected language (default: English).

2. POST /api/faqs
Creates a new FAQ.

3. Swagger Documentation

- The system includes Swagger API documentation that can be accessed at http://localhost:3000/api-docs for easy interaction with the API.

**Local Development Setup**

- Clone the repository:

```
git clone <repository-url>
cd faq-management
```

- Install dependencies:

`npm install`

- Set up environment variables:

Create a .env file in the root directory and configure the following variables:

```
MONGO_URI=<your-mongodb-uri>
REDIS_HOST=localhost
REDIS_PORT=6379
TRANSLATE_API_KEY=<your-translate-api-key>
```

- Start the application:

`npm start  or node server.js`


**Technologies Used**

> Node.js: The runtime environment for executing the backend logic.
> Express.js: The web framework for building RESTful API endpoints.
> MongoDB: The NoSQL database used for storing FAQs and their translations.
> Redis: The caching layer to store and retrieve FAQ data, improving performance and scalability.
> Swagger: Used for API documentation and easy testing.
> Axios: For making API requests to the translation service.

**Conclusion**
This FAQ management system is designed for scalability, performance, and ease of use. By leveraging Redis for caching, MongoDB for persistent storage, and integrating parallel translations, it offers a highly efficient solution for managing multilingual FAQs. The system is also ready for further enhancements like authentication and distributed Redis hosting, making it a solid foundation for a production-level application.

