package com.board.portfolio.service;

import com.board.portfolio.domain.dto.CommentDTO;
import com.board.portfolio.domain.entity.*;
import com.board.portfolio.exception.custom.NotAllowAccessException;
import com.board.portfolio.exception.custom.NotFoundCommentException;
import com.board.portfolio.exception.custom.NotFoundPostException;
import com.board.portfolio.repository.BoardRepository;
import com.board.portfolio.repository.CommentRepository;
import com.board.portfolio.repository.LikeCommentRepository;
import com.board.portfolio.security.account.AccountSecurityDTO;
import com.board.portfolio.socket.AlarmSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

import static com.board.portfolio.util.StaticUtils.modelMapper;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final LikeCommentRepository likeCommentRepository;
    private final AlarmSocketHandler alarmSocketHandler;

    @Transactional
    public Map getCommentList(long boardId,AccountSecurityDTO accountDTO) {
        List<Comment> commentList = commentRepository.getCommentList(new Board(boardId));
        List<Comment> likedCommentList = Optional.ofNullable(accountDTO.getEmail())
                .map(email->commentRepository.getLikedCommentList(new Board(boardId), new Account(email)))
                .orElse(new ArrayList<>());
        Map data = new HashMap();
        data.put("commentList", commentList);
        data.put("likedCommentList",likedCommentList);
        return data;
    }

    @Transactional
    public Map modifyComment(Long commentId, CommentDTO.Modify dto, AccountSecurityDTO accountDTO) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(NotFoundCommentException::new);
        if(!accountDTO.getEmail().equals(comment.getAccount().getEmail())){
            throw new NotAllowAccessException();
        }
        comment.setContent(dto.getContent());
        comment.setUpDate(LocalDateTime.now());

        Map data = new HashMap();
        data.put("boardId", comment.getBoard().getBoardId());
        return data;
    }

    @Transactional
    public Map deleteComment(Long commentId, AccountSecurityDTO accountDTO) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(NotFoundCommentException::new);
        if(!accountDTO.getEmail().equals(comment.getAccount().getEmail())){
            throw new NotAllowAccessException();
        }
        Optional<Comment> opChildCommnet =commentRepository.getChildComment(comment.getBoard(),comment.getGroup(),commentId);
        if(opChildCommnet.isPresent()){
            Comment childComment = opChildCommnet.get();
            childComment.increaseDelParentCnt(comment.getDelParentCnt()+1);
            childComment.setHasDelTypeParent(comment.isHasDelTypeParent());
        }
        commentRepository.delete(comment);

        Map data = new HashMap();
        data.put("boardId", comment.getBoard().getBoardId());
        return data;
    }

    @Transactional
    public Map writeComment(Long boardId, CommentDTO.Write dto, AccountSecurityDTO accountDTO) {
        Board board = boardRepository.findById(boardId).orElseThrow(NotFoundPostException::new);
        Comment comment = Comment.builder()
                .board(board)
                .content(dto.getContent())
                .account(new Account(accountDTO.getEmail()))
                .type(CommentType.PARENT)
                .group((long)-1)
                .hasDelTypeParent(true)
                .build();
        comment = commentRepository.save(comment);
        comment.setGroup(comment.getCommentId());

        alarmSocketHandler.commentAlarmProcess(comment.getBoard(),modelMapper.map(accountDTO, Account.class ) );

        Map data = new HashMap();
        data.put("boardId", comment.getBoard().getBoardId());
        return data;
    }

    @Transactional
    public Map likeComment(Long commentId, AccountSecurityDTO accountDTO) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(NotFoundCommentException::new );
        Account account = modelMapper.map(accountDTO, Account.class);

        Optional<LikeComment> opLikeComment = likeCommentRepository.findByCommentAndAccount(comment,account);
        if(opLikeComment.isPresent()){
            likeCommentRepository.delete(opLikeComment.get());
            comment.decreaseLike();
        }
        else{
            likeCommentRepository.save(new LikeComment(comment, account));
            comment.increaseLike();
        }

        Map data = new HashMap();
        data.put("like",comment.getLike());
        return data;
    }

    @Transactional
    public Map replyWriteComment(CommentDTO.Reply dto, AccountSecurityDTO accountDTO) {
        Comment parentComment = commentRepository.findById(dto.getCommentId()).orElseThrow(NotFoundCommentException::new);

        Comment comment = Comment.builder()
                .board(new Board(dto.getBoardId()))
                .content(dto.getContent())
                .account(new Account(accountDTO.getEmail()))
                .type(CommentType.CHILD)
                .group(parentComment.getGroup())
                .hasDelTypeParent(false)
                .build();
        comment = commentRepository.save(comment);

        alarmSocketHandler.replyCommentAlarmProcess(parentComment, modelMapper.map(accountDTO, Account.class ));

        Map data = new HashMap();
        data.put("boardId",dto.getBoardId());
        return data;
    }
}
