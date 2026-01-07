package com.saharsh.AiMeet.services;

import com.saharsh.AiMeet.Dto.MeetingDto;
import com.saharsh.AiMeet.models.Meeting;
import com.saharsh.AiMeet.models.Subtopic;
import com.saharsh.AiMeet.models.Users;
import com.saharsh.AiMeet.repos.MeetingRepository;
import com.saharsh.AiMeet.repos.SubtopicRepository;
import com.saharsh.AiMeet.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {

    @Autowired
    private MeetingRepository repo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SubtopicRepository subtopicRepo;

    private Meeting getmeetByid(long id) {
        Optional<Meeting> meet = repo.findById(id);
        return meet.orElse(null);
    }

    public List<Meeting> findBySubtopic_Id(Long subtopicId) {
        return repo.findBySubtopic_Id(subtopicId);
    }

    public List<Meeting> findByHost_Id(int hostId) {
        return repo.findByHost_Id(hostId);
    }

    public Meeting saveMeeting(MeetingDto dto) {
        Optional<Subtopic> subtopic = subtopicRepo.findById(dto.getSubtopicId());
        Optional<Users> user1 = userRepo.findById(dto.getHostid());

        if (user1.isPresent() && subtopic.isPresent()) {
            Meeting obj = new Meeting();
            obj.setHost(user1.get());
            obj.setSubtopic(subtopic.get());
            obj.setTitle(dto.getTitle());
            obj.setStartTime(dto.getStartTime());
            obj.setEndTime(dto.getEndTime());
            return repo.save(obj);
        } else {
            return null; // user or subtopic not found
        }
    }

    public Meeting saveSummary(MeetingDto dto) {
        Optional<Meeting> topic = repo.findById(dto.getMeetingId());
        if (topic.isPresent()) {
            topic.get().setAiSummary(dto.getAiSummary());
            return repo.save(topic.get());
        } else {
            return null; // topic not found to update
        }
    }
}
