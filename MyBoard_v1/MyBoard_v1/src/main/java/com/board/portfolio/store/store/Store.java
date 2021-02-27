package com.board.portfolio.store.store;

import com.board.portfolio.store.repository.StoredEntityIdentifier;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
@Slf4j
@Getter
public class Store<T extends StoredEntityIdentifier> {
    /**
     * mainRows와 subRows는 외부에서 참조하여 값이 바뀔 수 있음으로
     * 매우 주의가 필요함
     */
    private String name;
    private ConcurrentHashMap<String, T> mainRows; //ConcurrentMap
    private final long MAX_SIZE;

    public Store(String name, long MAX_SIZE){
        this.name = name;
        this.MAX_SIZE = MAX_SIZE;
    }
    public Store(String name, List<T> mainRows, long MAX_SIZE){
        this(name, MAX_SIZE);
        this.mainRows = new ConcurrentHashMap<>();
        mainRows.stream().limit(MAX_SIZE).forEach(o->this.mainRows.put(o.getId().toString(),o));
    }
    public long savedRowSize(){
        return mainRows.size();
    }
    public void resetRows(){
        mainRows.clear();
    }
    public List<T> getMainRows(){
        List list = new ArrayList<T>(mainRows.values());
        list.sort(getSort());
        return list;
    }
    private Comparator<T> getSort(){
        Comparator<T> comparator = (o1, o2)->{
            long id1= Long.valueOf(o1.getId().toString());
            long id2 = Long.valueOf(o2.getId().toString());
            return id1<id2?1:id1==id2?0:-1;
        };
        return comparator;
    }
    public Optional<T> findById(Object id){
        return Optional.ofNullable(mainRows.get(id.toString()));
    }

    public void saveRow(T row) {
        mainRows.put(row.getId().toString(),row);
        if(mainRows.size() > MAX_SIZE){
            List<T> list = new ArrayList<T>(mainRows.values());
            list.sort(getSort());
            mainRows.remove(list.get((int) MAX_SIZE).getId().toString());
        }
    }

    public void deleteRow(T entity) {
        mainRows.remove(entity.getId().toString());
    }
}
