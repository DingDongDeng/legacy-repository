package com.board.portfolio.domain.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "TB_LIKE_BOARD")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class LikeBoard extends EntityDefaultValues{

    @Id
    @Column(name="LIKE_BOARD_ID")
    private String likeBoardId;

    @ManyToOne
    @JoinColumn(name = "BOARD_ID")
    @JsonManagedReference
    private Board board;

    @ManyToOne
    @JoinColumn(name="EMAIL")
    @JsonManagedReference
    private Account account;

    @Column(name = "REG_DATE")
    @CreatedDate
    private LocalDateTime regDate;

    public LikeBoard(Board board, Account account){
        this.board = board;
        this.account = account;
    }

    @Override
    public void setDefaultValues() {
        this.likeBoardId = UUID.randomUUID().toString();
    }
}
