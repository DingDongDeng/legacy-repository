package com.board.portfolio.domain.entity;

import com.board.portfolio.store.repository.StoredBoardRepository;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "TB_BOARD")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BoardDetail extends BoardCore implements Serializable {

    @Column(name = "CONTENT")
    private String content;

    @OneToMany(mappedBy = "board")
    @JsonBackReference
    private List<Comment> commentList;

    @OneToMany(mappedBy = "board")
    @JsonBackReference
    private List<LikeBoard> likeBoardList;

    @OneToMany(mappedBy = "board")
    @JsonBackReference
    private List<FileAttachment> fileAttachmentList;

    public BoardDetail(long boardId) {
        super(boardId);
    }

    public void updatePost(String title, String content, LocalDateTime upDate){
        updatePost(title,upDate);
        this.content = content;
    }
    public void updatePost(String title, String content, LocalDateTime upDate, StoredBoardRepository storedBoardRepository){
        updatePost(title,content,upDate);
        storedBoardRepository.updatePost(getBoardId(), title,content,upDate);
    }

    public Board transToBoard(){
        return new Board(getBoardId(),
                getTitle(),
                getLike(),
                getView(),
                getRegDate(),
                getUpDate(),
                getAccount());
    }

    @Override
    public Long getId() {
        return getBoardId();
    }
}
