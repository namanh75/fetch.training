package com.example.qrscanner.sqlite.ORM;

import android.content.Context;
import android.database.Cursor;

import java.util.List;

public interface IHistory<T> {

    public T cursorToObject(Cursor cursor);

    public void add(Context context, T t);

    public void clearAll(Context context, String nameTable);

    public List<T> getAll(Context context, String nameTable, int n);

    public T getOne(int id);

    public void deleteOne( Context context,int id);

}
