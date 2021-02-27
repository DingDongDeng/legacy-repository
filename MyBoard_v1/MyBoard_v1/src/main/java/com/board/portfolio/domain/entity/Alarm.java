package com.board.portfolio.domain.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Entity
@Table(name = "TB_ALARM")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Alarm extends EntityDefaultValues{

    @Id
    @Column(name="ALARM_ID")
    private String alarmId;

    @ManyToOne
    @JoinColumn(name = "TARGET_ACCOUNT")
    @JsonManagedReference
    private Account targetAccount;

    @ManyToOne
    @JoinColumn(name = "TRIGGER_ACCOUNT")
    @JsonManagedReference
    private Account triggerAccount;

    @Column(name = "EVENT_TYPE")
    @Enumerated(value = EnumType.STRING)
    private AlarmEventType eventType;

    @Column(name="EVENT_CONTENT_ID")
    private String eventContentId;

    @Column(name = "RECIEVE_DATE")
    @CreatedDate
    private LocalDateTime recieveDate;

    @Column(name = "CHECK_DATE")
    private LocalDateTime checkDate;

    @Override
    public void setDefaultValues() {
        this.alarmId = Optional.ofNullable(this.alarmId).orElse(UUID.randomUUID().toString());
    }
}
