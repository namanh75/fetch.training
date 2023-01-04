package com.example.qrscanner.ui.history;

import static com.example.qrscanner.sqlite.ORM.HistoryORM.TABLE_NAME;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import com.example.qrscanner.Adapter.HistoryAdapter;
import com.example.qrscanner.EditHistory;
import com.example.qrscanner.Entity.History;
import com.example.qrscanner.R;
import com.example.qrscanner.databinding.FragmentHistoryBinding;
import com.example.qrscanner.sqlite.ORM.HistoryORM;
import java.util.List;

public class HistoryFragment extends Fragment {

    private FragmentHistoryBinding binding;

    private ListView listView;

    HistoryORM historyORM = new HistoryORM();

    public List<History> historyList;

    private Button listScan;

    private Button listCreate;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        HistoryViewModel dashboardViewModel =
                new ViewModelProvider(this).get(HistoryViewModel.class);

        binding = FragmentHistoryBinding.inflate(inflater, container, false);
        listView = binding.listView;
        listScan = binding.historyScan;
        listCreate = binding.historyCreate;

        getHistory(TABLE_NAME, 1);

        listScan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getHistory(TABLE_NAME, 1);
            }
        });

        listCreate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getHistory(TABLE_NAME, 2);
            }
        });

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                History history = historyList.get(i);

                Intent intent = new Intent(getActivity(), EditHistory.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                intent.putExtra("id", history.getId());
                intent.putExtra("context", history.getContext());
                intent.putExtra("date", history.getDate());
                intent.putExtra("image", history.getBitmap());
                startActivity(intent);
            }
        });

        View root = binding.getRoot();

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    public void getHistory(String nameTable, int classify) {
        historyList = historyORM.getAll(getContext(), nameTable, classify);
        HistoryAdapter adapter = new HistoryAdapter(getContext(), R.layout.custom_list_view, historyList);
        listView.setAdapter(adapter);
    }
}