# Murugan Online Retail Platform - System Architecture Design

## Goal Description
Design a scalable, reliable, and high-performance online retail platform similar to Amazon. The system will handle high concurrency, secure payments, AI-driven recommendations, and robust inventory management.

## User Review Required
> [!IMPORTANT]
> This is a high-level architectural design. Please review the chosen technologies and cloud services to ensure they align with your operational capabilities and budget.

## Proposed Architecture

### 1. High-Level Architecture
The system will follow a **Microservices Architecture** pattern to ensure scalability and maintainability.

**Core Components:**
- **Frontend Clients**: Mobile App (React Native/Flutter), Web App (Next.js/React).
- **API Gateway**: Entry point for all client requests, handling routing, rate limiting, and authentication.
- **Microservices**: Independent services for User, Catalog, Cart, Order, Payment, and Notification.
- **Event Bus**: Kafka or RabbitMQ for asynchronous communication between services.
- **Data Layer**: Polyglot persistence (SQL for transactional data, NoSQL for product catalogs, Redis for caching).

### 2. Technology Stack (Open Source & Cost-Optimized)

#### Frontend (Free & Open Source)
- **Web**: Next.js (MIT License) - React Framework for Production.
- **Mobile**: Flutter (BSD License) or React Native (MIT) - Single codebase for iOS/Android.
- **Styling**: Tailwind CSS (MIT) - Utility-first CSS framework.

#### Backend (Open Source Microservices)
- **Languages**: Node.js (Open JS Foundation), Go (Google Open Source), or Python (PSF).
- **Frameworks**: NestJS (MIT) or Express.js.
- **API Gateway**: **Kong Gateway (OSS version)** or **Nginx** (BSD) - Free, high-performance reverse proxy & gateway.

#### Database (Self-Hosted/Community Editions)
- **Relational**: PostgreSQL (Open Source) - Robust, free SQL database.
- **NoSQL**: MongoDB Community Edition (SSPL) - Free for self-hosting.
- **Caching**: Redis (BSD) - In-memory data store.
- **Search**: **MeiliSearch** (MIT) or **OpenSearch** (Apache 2.0) - Great free alternatives to paid Algolia/ELK.

#### AI & Analytics (Open Source)
- **Recommendation Engine**: Custom Python service using **Scikit-learn** or **TensorFlow** (Apache 2.0).
- **Data Processing**: **Apache Spark** (Apache 2.0) for large-scale data processing if needed, or simple Cron jobs for smaller scale.

#### Infrastructure & Deployment (Free Tier Friendly)
- **Containerization**: Docker (Apache 2.0).
- **Orchestration**: **Kubernetes (K8s)** (CNCF) or **Docker Swarm** (Simpler, free).
- **CI/CD**: Jenkins (MIT) or GitHub Actions (Free tier for public/private repos).
- **Hosting**: Can be deployed on any VPS (DigitalOcean, Linode) or Free Tiers (Oracle Cloud Free Tier offers generous ARM instances, AWS Free Tier).

### 3. Key Modules Breakdown

#### A. Frontend
- **Hosting**: Vercel (Free Hobby Tier) or Netlify for Web.

#### B. API Gateway
- Use **Nginx** as the entry point. Handles SSL, Load Balancing, and basic Rate Limiting for free.

#### C. Core Microservices
1.  **Identity Service**: Keycloak (Apache 2.0) for open-source Identity and Access Management (IAM).
2.  **Catalog, Cart, Order, Inventory**: Custom Node/Go services.
3.  **Payment Service**:
    - **Open Source Billing**: **Kill Bill** (Apache 2.0) for subscription/recurring billing logic.
    - **Gateway**: **Stripe** or **Razorpay** (No monthly fees, pay-per-transaction). *Note: Processing money always incurs a small transaction fee from the banking network, but the software integration is free.*

### 4. Security Best Practices (Open Source Tools)
- **SSL/TLS**: Let's Encrypt (Free Certificates).
- **WAF**: ModSecurity (Open Source WAF) with Nginx.
- **Auth**: OAuth2/OIDC via Keycloak.
- **Scanning**: OWASP ZAP (Free security scanner).

### 5. Payment Gateway Integration
- Use an abstraction layer to support multiple providers (Stripe, PayPal, etc.).
- Implement idempotency keys to prevent double charging.

### 6. Architecture Diagram

```mermaid
graph TD
    User[User Client (Web/Mobile)]
    LB[Load Balancer (Nginx)]
    CDN[CDN (Cloudflare Free / Varnish)]
    Gateway[API Gateway (Kong/Nginx)]

    subgraph "Microservices Cluster (K8s/Docker Swarm)"
        Auth[Identity (Keycloak)]
        Catalog[Catalog Service]
        Cart[Cart Service]
        Order[Order Service]
        Pay[Payment Service]
        Reco[AI Reco (Scikit/TF)]
    end

    subgraph "Data Layer"
        SQL[(PostgreSQL)]
        NoSQL[(MongoDB)]
        Redis[(Redis)]
        Search[(MeiliSearch/OpenSearch)]
    end

    EventBus{Event Bus (Kafka/RabbitMQ)}

    User --> CDN
    User --> LB --> Gateway
    Gateway --> Auth
    Gateway --> Catalog
    Gateway --> Cart
    Gateway --> Order

    Catalog --> NoSQL
    Catalog --> Redis
    Catalog --> Search

    Order --> SQL
    Order --> Pay
    
    Pay --> ExternalPay[Stripe/Razorpay]
    
    Order --> EventBus
    EventBus --> Reco
    Reco --> Redis
```


1.  **User Visits**: Request hits CDN/LB.
2.  **Product Search**: Gateway routes to **Search Service** (Elasticsearch).
3.  **Add to Cart**: Gateway routes to **Cart Service** (Redis backed).
4.  **Checkout**:
    - **Order Service** creates a pending order.
    - **Payment Service** processes payment.
    - On success, **Inventory Service** decrements stock (ACID transaction).
    - **Notification Service** sends email/SMS (via Event Bus).

## Verification Plan
1.  **Architecture Review**: Confirm component interaction flows.
2.  **PoC Implementation**: Build a skeleton with Gateway + 1 Service (e.g., Catalog) to validate the stack.
