package com.board.portfolio.store.repository;

import com.board.portfolio.store.manager.StoreManager;
import com.board.portfolio.store.store.Store;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

public abstract class StoredRepository<T extends StoredEntityIdentifier<?>> {
    private StoreManager sm;
    private Store<T> store;

    public StoredRepository(String name, StoreManager sm){
        this.store = (Store<T>)(sm.getStoreMap().get(name));
        this.sm = sm;
    }

    private List<T> getMainRows(){
        return this.store.getMainRows();
    }
    public long storedSize(){
        return this.store.savedRowSize();
    }
    public void saveStore(T entity){
        store.saveRow(entity);
    }
    public void deleteStore(T entity){
        store.deleteRow(entity);
    }
    public List<T> getList(){
        return this.store.getMainRows();
    }
    public List<T> getList(long start, long size){
        return getMainRows().stream()
                .skip(start-1)
                .limit(size)
                .collect(Collectors.toList());
    }
    public List<?> getList(long start, long size, Function<T,?> func){
        return getMainRows().stream()
                .map(func)
                .skip(start-1)
                .limit(size)
                .collect(Collectors.toList());
    }

    public Optional<T> findByIdFromStore(String id){
        return store.findById(id);
    }
    public Optional<T> findByIdFromStore(Long id ){
        return store.findById(id);
    }

    public abstract T save(T entity);
    public abstract void delete(T entity);

}
