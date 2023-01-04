package com.example.qrscanner.sqlite.ORM;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.example.qrscanner.sqlite.DatabaseHelper;

import com.example.qrscanner.Entity.History;

import java.util.ArrayList;
import java.util.List;

public class HistoryORM implements IHistory<History> {

    private static DbBitmapUtility dbBitmapUtility = new DbBitmapUtility();

    public static final String TABLE_NAME = "history";
    private static final String COMMA_SEPARATOR = ", ";

    private static final String COLUMN_ID_TYPE = "integer PRIMARY KEY AUTOINCREMENT";
    private static final String COLUMN_ID = "id";

    private static final String COLUMN_CONTEXT_TYPE = "TEXT";
    private static final String COLUMN_CONTEXT = "context";

    private static final String COLUMN_DATE_TYPE = "TEXT";
    private static final String COLUMN_DATE = "date";

    private static final String COLUMN_CLASSIFY_TYPE = "INTEGER";
    private static final String COLUMN_CLASSIFY = "classify";

    private static final String COLUMN_BIT_TYPE = "BLOB";
    private static final String COLUMN_BITMAP = "bitmap";

    public static final String SQL_DROP_TABLE =
            "DROP TABLE IF EXISTS " + "";

    //create table history
    public static final String SQL_CREATE_TABLE = "CREATE TABLE IF NOT EXISTS " + TABLE_NAME + " (" +
            COLUMN_ID + " " + COLUMN_ID_TYPE + COMMA_SEPARATOR +
            COLUMN_DATE + " " + COLUMN_DATE_TYPE + COMMA_SEPARATOR +
            COLUMN_CLASSIFY + " " + COLUMN_CLASSIFY_TYPE + COMMA_SEPARATOR +
            COLUMN_CONTEXT + " " + COLUMN_CONTEXT_TYPE + COMMA_SEPARATOR +
            COLUMN_BITMAP + " " + COLUMN_BIT_TYPE + ")";

    @SuppressLint("Range")
    @Override
    public History cursorToObject(Cursor cursor) {
        History history = new History();
        history.setId(cursor.getInt(cursor.getColumnIndex(COLUMN_ID)));
        history.setDate(cursor.getString(cursor.getColumnIndex(COLUMN_DATE)));
        history.setContext(cursor.getString(cursor.getColumnIndex(COLUMN_CONTEXT)));
        cursor.getColumnIndex(COLUMN_BITMAP);
        history.setBitmap(cursor.getBlob(cursor.getColumnIndex(COLUMN_BITMAP)));
        return history;
    }

    @Override
    public void add(Context context, History history) {
        DatabaseHelper databaseHelper = new DatabaseHelper(context);
        SQLiteDatabase database = databaseHelper.getWritableDatabase();

        ContentValues contentValues = new ContentValues();
        contentValues.put(COLUMN_DATE, history.getDate());
        contentValues.put(COLUMN_CONTEXT, history.getContext());
        contentValues.put(COLUMN_CLASSIFY, history.getClassify());
        contentValues.put(COLUMN_BITMAP, history.getBitmap());
        database.insert(TABLE_NAME, null, contentValues);
        database.close();
    }

    @Override
    public void clearAll(Context context, String nameTable) {
        DatabaseHelper databaseHelper = new DatabaseHelper(context);
        SQLiteDatabase database = databaseHelper.getReadableDatabase();
        database.delete(nameTable, null, null);
    }

    @Override
    public List<History> getAll(Context context, String nameTable, int x) {
        DatabaseHelper databaseHelper = new DatabaseHelper(context);
        SQLiteDatabase database = databaseHelper.getReadableDatabase();
        List<History> historyList = new ArrayList<>();

        Cursor cursor = database.rawQuery("SELECT * FROM " + nameTable + " Where " + COLUMN_CLASSIFY + " = " + x , null);
        try {
            if (cursor.moveToFirst()) {
                do {
                    History h = cursorToObject(cursor);
                    historyList.add(h);
                } while(cursor.moveToNext());
            }
        } catch (Exception e) {
            Log.d("Error" ,"Error while trying to get history from database");
        } finally {
            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
        }
        database.close();

        return historyList;
    }

    @Override
    public History getOne(int id) {
        return null;
    }

    @Override
    public void deleteOne(Context context, int id) {
        DatabaseHelper databaseHelper = new DatabaseHelper(context);
        SQLiteDatabase database = databaseHelper.getWritableDatabase();


        database.rawQuery("DELETE FROM " + TABLE_NAME + " WHERE " + COLUMN_ID + "=" + id, null);

        database.close();
    }
}
