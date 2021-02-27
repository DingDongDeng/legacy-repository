package com.board.portfolio.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "TB_COMMENT")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Comment extends EntityDefaultValues{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="COMMENT_ID")
    private Long commentId;

    @ManyToOne
    @JoinColumn(name = "BOARD_ID")
    @JsonManagedReference
    private Board board;

    @Column(name = "CONTENT")
    private String content;

    @Column(name="LIKE_")
    private Integer like;

    @Column(name = "REG_DATE")
    @CreatedDate
    private LocalDateTime regDate;

    @Column(name = "UP_DATE")
    private LocalDateTime upDate;

    @ManyToOne
    @JoinColumn(name="EMAIL")
    @JsonManagedReference
    private Account account;

    @Column(name="GROUP_")
    private Long group;

    @Column(name="DEL_PARENT_CNT")
    private Integer delParentCnt;

    @Column(name="HAS_DEL_TYPE_PARENT")
    private boolean hasDelTypeParent;

    @Column(name="TYPE")
    @Enumerated(value = EnumType.STRING)
    private CommentType type;

    @OneToMany(mappedBy = "comment")
    @JsonBackReference
    private List<LikeComment> likeCommentList;

    public void increaseLike(){
        this.like++;
    }

    public void decreaseLike(){
        this.like--;
    }
    public void increaseDelParentCnt(){
        this.delParentCnt++;
    }
    public void increaseDelParentCnt(int cnt){
        this.delParentCnt += cnt;
    }

    @Override
    public void setDefaultValues() {
        this.like = Optional.ofNullable(this.like).orElse(0);
        this.delParentCnt = Optional.ofNullable(this.delParentCnt).orElse(0);
    }
}
