# AI-Based Meeting Summarizer

## Project Overview
The AI-Based Meeting Summarizer is a scalable, intelligent platform designed to automatically transcribe meeting audio and generate concise summaries using AI. The system is built on a **microservices architecture**, leveraging **Whisper for speech-to-text**, **Ollama for LLM-powered summarization**, and **Apache Kafka for asynchronous processing**, ensuring high scalability, reliability, and performance.

---

## Key Features
- **Automated Audio Transcription**: Converts meeting audio into accurate text using Whisper.
- **AI-Powered Summarization**: Uses Gemini and Ollama-based LLMs to generate structured and concise meeting summaries.
- **Microservices Architecture**: Independent, loosely coupled services for better scalability and maintainability.
- **Asynchronous Processing**: Apache Kafka enables non-blocking communication between services.
- **Service Discovery**: Netflix Eureka for dynamic service registration and discovery.
- **User-Friendly Frontend**: Upload audio files and view transcripts and summaries easily.

---

## Quick Start Guide

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-meeting-summarizer
```
### 2. Backend Setup (Java – Spring Boot Microservices)
Ensure you have:
Java 17+
Maven
Apache Kafka & Zookeeper running
Start services in the following order:
```bash
# Start Eureka Server
cd eureka-server
mvn spring-boot:run
```
```bash
# Start Main Backend Service
cd backend
mvn spring-boot:run
```
```bash
# Start Admin Server 
cd admin-server
mvn spring-boot:run
```
```bash
# Start Gemini / Ollama Integration Service
cd Gemini-Integration
mvn spring-boot:run
```
### 3. Whisper Microservice (Python)
Install Dependencies
```bash
pip install openai-whisper flask kafka-python torch
```
Run Whisper Service
```bash
python local_whisper_api.py
```
### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will start on:
```bash
http://localhost:5731
```
---
## 🔄 Workflow
1. User uploads meeting audio via the frontend  
2. Main backend publishes an audio processing request to Kafka  
3. Whisper microservice consumes the request and transcribes the audio  
4. Transcribed text is published back to Kafka  
5. Ollama/Gemini microservice consumes the transcript and generates a meeting summary  
6. Final transcript and summary are returned to the main backend
7. Transcript visible on frontend
---

 Made with ❤️ by Saharsh
