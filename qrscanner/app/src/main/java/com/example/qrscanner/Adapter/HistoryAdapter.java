package com.example.qrscanner.Adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;
import com.example.qrscanner.Entity.History;
import com.example.qrscanner.R;

import java.util.List;

public class HistoryAdapter extends BaseAdapter {

    // Variables
    public List<History> historyList;
    public Context context;

    public int layout;


    public HistoryAdapter(Context context, int layout, List<History> historyList) {
        this.context = context;
        this.layout = layout;
        this.historyList = historyList;
    }

    public HistoryAdapter(List<History> historyList) {
        this.historyList = historyList;
    }

    @Override
    public int getCount() {
        return historyList.size();
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        view = layoutInflater.inflate(layout, null);

        TextView contentContext = (TextView) view.findViewById(R.id.content_context);
        contentContext.setText(historyList.get(i).getContext());

        TextView contentDate = (TextView) view.findViewById(R.id.content_date);
        contentDate.setText(historyList.get(i).getBitmap().toString());

        return view;
    }
}
