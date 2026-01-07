package com.saharsh.AiMeet.Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MeetingDto {

    private Long meetingId;

    private String title;

    private String aiSummary;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private int  hostid;

    private Long subtopicId;
}
