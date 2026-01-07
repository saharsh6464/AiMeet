package com.saharsh.AiMeet.controller;

import com.saharsh.AiMeet.Dto.MeetingDto;
import com.saharsh.AiMeet.models.Meeting;
import com.saharsh.AiMeet.services.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "*") // optional, allows frontend to call from any domain
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    // ✅ Create a new meeting
    @PostMapping
    public Meeting createMeeting(@RequestBody MeetingDto meetingDto) {
        return meetingService.saveMeeting(meetingDto);
    }

    // ✅ Update AI summary for a meeting
    @PutMapping("/{meetingId}/summary")
    public Meeting updateSummary(@PathVariable Long meetingId, @RequestBody MeetingDto dto) {
        dto.setMeetingId(meetingId); // ensure id is set
        return meetingService.saveSummary(dto);
    }

    // ✅ Get all meetings under a specific subtopic
    @GetMapping("/subtopic/{subtopicId}")
    public ResponseEntity<List<Meeting>> getMeetingsBySubtopic(@PathVariable Long subtopicId) {
        List<Meeting> meetings = meetingService.findBySubtopic_Id(subtopicId);
        return ResponseEntity.ok(meetings);
    }

    // ✅ Get all meetings hosted by a specific user
    @GetMapping("/host/{hostId}")
    public ResponseEntity<List<Meeting>> getMeetingsByHost(@PathVariable int hostId) {
        List<Meeting> meetings = meetingService.findByHost_Id(hostId);
        return ResponseEntity.ok(meetings);
    }

    // ✅ (optional) Get a meeting by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getMeetingById(@PathVariable Long id) {
        // Reuse your internal method through service
        Meeting meeting = meetingService.findBySubtopic_Id(id).stream().findFirst().orElse(null);
        if (meeting != null) {
            return ResponseEntity.ok(meeting);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
