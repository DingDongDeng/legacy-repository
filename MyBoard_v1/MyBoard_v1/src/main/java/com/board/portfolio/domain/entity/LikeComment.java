package com.board.portfolio.domain.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "TB_LIKE_COMMENT")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class LikeComment extends EntityDefaultValues{

    @Id
    @Column(name="LIKE_COMMENT_ID")
    private String likeCommentId;

    @ManyToOne
    @JoinColumn(name = "COMMENT_ID")
    @JsonManagedReference
    private Comment comment;

    @ManyToOne
    @JoinColumn(name="EMAIL")
    @JsonManagedReference
    private Account account;

    @Column(name = "REG_DATE")
    @CreatedDate
    private LocalDateTime regDate;

    public LikeComment(Comment comment, Account account) {
        this.comment = comment;
        this.account = account;
    }

    @Override
    public void setDefaultValues() {
        this.likeCommentId = UUID.randomUUID().toString();
    }
}
