package com.board.portfolio.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "TB_BOARD")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Board extends BoardCore {
    @OneToMany(mappedBy = "board")
    @JsonBackReference
    private List<Comment> commentList;

    @OneToMany(mappedBy = "board")
    @JsonBackReference
    private List<LikeBoard> likeBoardList;

    @OneToMany(mappedBy = "board")
    @JsonBackReference
    private List<FileAttachment> fileAttachmentList;

    public Board(Long boardId) {
        super(boardId);
    }
    public Board(Long boardId, String title , Integer like, Integer view,
                 LocalDateTime regDate, LocalDateTime update, Account account){
        super(boardId,title,like,view,regDate,update,account);
    }

    @Override
    public Long getId() {
        return getBoardId();
    }
}
