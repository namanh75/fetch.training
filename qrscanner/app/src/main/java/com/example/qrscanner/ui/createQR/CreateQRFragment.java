package com.example.qrscanner.ui.createQR;

import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.qrscanner.Entity.History;
import com.example.qrscanner.databinding.FragmentCreateqrBinding;
import com.example.qrscanner.sqlite.ORM.DbBitmapUtility;
import com.example.qrscanner.sqlite.ORM.HistoryORM;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.integration.android.IntentResult;
import com.journeyapps.barcodescanner.BarcodeEncoder;

import java.util.Calendar;

public class CreateQRFragment extends Fragment {

    private FragmentCreateqrBinding binding;

    private Button create;

    HistoryORM historyORM = new HistoryORM();

    private EditText formInput;

    public static final int Classify_Create = 2;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        CreateQRViewModel dashboardViewModel =
                new ViewModelProvider(this).get(CreateQRViewModel.class);

        binding = FragmentCreateqrBinding.inflate(inflater, container, false);


        create = binding.create;
        formInput = binding.formInput;
        create.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String input = formInput.getText().toString().trim();
                try {
                    BarcodeEncoder barcodeEncoder = new BarcodeEncoder();
                    Bitmap bitmap = barcodeEncoder.encodeBitmap(input, BarcodeFormat.QR_CODE, 400, 400);
                    ImageView imageViewQrCode = binding.output;
                    imageViewQrCode.setImageBitmap(bitmap);
                    addToDB(input, DbBitmapUtility.getBytes(bitmap));
                } catch(Exception e) {
                    e.printStackTrace();
                }
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

    private Void addToDB(String context, byte[] bitmap) {
        String myDate = java.text.DateFormat.getDateTimeInstance().format(Calendar.getInstance().getTime());
        History history = new History();

        history.setContext(context);
        history.setDate(myDate);
        history.setClassify(Classify_Create);

        System.out.println(bitmap);
        history.setBitmap(bitmap);
        historyORM.add(getContext(), history);
        return null;
    }
}