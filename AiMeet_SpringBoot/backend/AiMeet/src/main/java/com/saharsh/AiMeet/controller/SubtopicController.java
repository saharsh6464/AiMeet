package com.saharsh.AiMeet.controller;
import com.saharsh.AiMeet.Dto.SubtopicDto;
import com.saharsh.AiMeet.models.Subtopic;
import com.saharsh.AiMeet.models.Topic;
import com.saharsh.AiMeet.repos.TopicRepository;
import com.saharsh.AiMeet.services.SubtopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subtopics")
public class SubtopicController {

    @Autowired
    private TopicRepository repo;

    @Autowired
    private SubtopicService subtopicService;

    // ✅ Create a new Subtopic under a Topic
    @PostMapping
    public Subtopic createSubtopic(
            @RequestParam String name,
            @RequestParam Long topicId
    ) {
        return subtopicService.saveTopic(name, topicId);
    }

    // ✅ Get all Subtopics for a specific Topic
    @PostMapping("/topic")
    public ResponseEntity<?> getSubtopicsByTopic(@RequestBody SubtopicDto subtopicDto) {
        Optional<Topic> cur = repo.findByTopicAccessId(subtopicDto.getTopicAccessId());
        if(cur.isPresent()){
            if(cur.get().getAccessPassword().equals(subtopicDto.getAccessPassword())){
                System.out.println("entered");
                return ResponseEntity.ok(subtopicService.findByParentTopic_Id(cur.get().getId()));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid Crendentails");
    }

    // ✅ Search Subtopics by name (case-insensitive)
    @GetMapping("/search")
    public ResponseEntity<List<Subtopic>> searchSubtopicsByName(@RequestParam String name) {
        List<Subtopic> results = subtopicService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(results);
    }
}

