package com.saharsh.AiMeet.controller;

import com.saharsh.AiMeet.Dto.TopicDto;
import com.saharsh.AiMeet.models.Topic;
import com.saharsh.AiMeet.services.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    // ✅ Create a new topic
    @PostMapping
    public Topic createTopic(@RequestBody TopicDto dto) {
        return topicService.saveTopic(dto);
    }

    // ✅ Get all topics created by a user
    @GetMapping("/user/{userId}")
    public List<TopicDto> getTopicsByUser(@PathVariable Long userId) {
        System.out.println("Called getTopcics BY user");
        return topicService.getTopics(userId);
    }

    // ✅ Access subtopics of a topic via access ID and password
    @PostMapping("/access")
    public Object getSubtopicsByAccess(
            @RequestParam String topicAccessId,
            @RequestParam String accessPassword
    ) {
        return topicService.getSubTopics(topicAccessId, accessPassword);
    }
}
