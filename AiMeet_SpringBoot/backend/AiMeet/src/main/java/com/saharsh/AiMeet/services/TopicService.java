package com.saharsh.AiMeet.services;
import com.saharsh.AiMeet.Dto.SubtopicDto;
import com.saharsh.AiMeet.Dto.TopicDto;
import com.saharsh.AiMeet.models.Subtopic;
import com.saharsh.AiMeet.models.Topic;
import com.saharsh.AiMeet.models.Users;
import com.saharsh.AiMeet.repos.SubtopicRepository;
import com.saharsh.AiMeet.repos.TopicRepository;
import com.saharsh.AiMeet.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class TopicService {

    @Autowired
    private TopicRepository repo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SubtopicRepository subtopicRepo;

    @Transactional(readOnly = true)
    public Object getSubTopics(String topicAccessId, String accessPassword) {
        Optional<Topic> obj = repo.findByTopicAccessId(topicAccessId);
        if (obj.isPresent()) {
            Topic cur = obj.get();
            if (Objects.equals(cur.getAccessPassword(), accessPassword)) {
               List<Subtopic> list = subtopicRepo.findByParentTopic_Id(cur.getId());
                return list; // shallow immutable copy
            } else {
                return Map.of("error", "Invalid Access");
            }
        } else {
            return Map.of("error", "Topic not found");
        }
    }


    public Topic saveTopic(TopicDto dto) {
        Optional<Users> user1 = userRepo.findById(dto.getUserId());
        if (user1.isPresent()) {
            Topic obj = new Topic();
            Users curUser = user1.get();
            obj.setName(dto.getName());
            obj.setTopicAccessId(dto.getTopicAccessId());
            obj.setAccessPassword(dto.getAccessPassword());
            obj.setCreatedBy(curUser);
            Topic curObj =  repo.save(obj);
            System.out.println(curObj);
            return curObj;
        } else {
            return null; // user not found
        }
    }

    public List<TopicDto> getTopics(Long id) {
        List<Topic> list = repo.findAllBycreatedBy_Id(id);
        List<TopicDto> ans = new ArrayList<>();
        for (Topic x : list) {
            TopicDto dto = new TopicDto();
            dto.setId(x.getId());
            dto.setName(x.getName());
            dto.setTopicAccessId(x.getTopicAccessId());
            dto.setAccessPassword(x.getAccessPassword());
            ans.add(dto);
        }
        return ans;
    }

}
