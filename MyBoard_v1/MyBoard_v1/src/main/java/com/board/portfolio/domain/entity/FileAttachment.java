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
@Table(name = "TB_FILE_ATTACHMENT")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class FileAttachment extends EntityDefaultValues{

    @Id
    @Column(name="FILE_ID")
    private String fileId;

    @ManyToOne
    @JoinColumn(name = "BOARD_ID")
    @JsonManagedReference
    private BoardDetail board;

    @Column(name = "ORIGIN_NAME")
    private String originName;

    @Column(name="SAVE_NAME")
    private String saveName;

    @Column(name="EXTENSION")
    private String extension;

    @Column(name="DOWN")
    private Integer down;

    @Column(name = "SAVE_DATE")
    @CreatedDate
    private LocalDateTime saveDate;

    @ManyToOne
    @JoinColumn(name="EMAIL")
    @JsonManagedReference
    private Account account;

    public void increaseDown(){
        this.down++;
    }

    @Override
    public void setDefaultValues() {
        this.fileId = UUID.randomUUID().toString();
        this.down = Optional.ofNullable(this.down).orElse(0);
    }
}
