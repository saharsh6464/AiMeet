package com.saharsh.Gemini.Integration.controller;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller to demonstrate interaction with the Gemini 2.5 Flash model
 * via the Spring AI ChatClient.
 */
@RestController
public class GeminiController {

    private final ChatClient chatClient;


    public GeminiController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }


    @GetMapping("/ai/chat")
    public String chatWithGemini(@RequestParam(value = "prompt", defaultValue = "What is Spring Boot and why is it popular?") String prompt) {

        String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return response;
    }

    /*
     * Builds and sends a multimodal (text + image) prompt to Gemini:
     *  - chatClient.prompt() → starts building a new prompt (this gives a builder prompt object)
     *  - .user(...) → defines the user message
     *  - .text(query) → adds the text part of the message
     *  - .media(MimeTypeUtils.IMAGE_JPEG, file.getResource()) → attaches the image
     *  - .call() → sends the request to the model
     *  - .content() → returns the model's text output
     */
    @GetMapping("ai/describe")
    public String descImage(@RequestParam String query , @RequestParam MultipartFile file){
        return chatClient
                .prompt()
                .user(us-> us.text(query)
                        .media(MimeTypeUtils.IMAGE_JPEG,file.getResource()))
                .call()
                .content();
    }

    @PostMapping("ai/audio")
    public String descAudio(@RequestParam String query , @RequestParam MultipartFile file){
        return chatClient
                .prompt()
                .user(us-> us.text(query)
                        .media(MimeTypeUtils.parseMimeType("audio/ogg"), file.getResource()))
                .call()
                .content();
    }
}
