package com.saharsh.AiMeet;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "GEMINI-INTEGRATION")
public interface fienClient {

    @PostMapping("ai/audio")
    public String descAudio(@RequestParam String query , @RequestParam MultipartFile file);

    @GetMapping("/ai/chat")
    public String chatWithGemini(@RequestParam(value = "prompt", defaultValue = "What is Spring Boot and why is it popular?") String prompt);
}
