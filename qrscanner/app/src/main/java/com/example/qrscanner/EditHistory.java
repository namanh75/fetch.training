package com.example.qrscanner;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import com.example.qrscanner.databinding.ActivityEditHistoryBinding;
import com.example.qrscanner.sqlite.ORM.DbBitmapUtility;
import com.example.qrscanner.sqlite.ORM.HistoryORM;

public class EditHistory extends AppCompatActivity {

    private ActivityEditHistoryBinding binding;

    private ImageView imageViewQR;

    private TextView context;

    private TextView date;

    private Button delete;

    private HistoryORM historyORM;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        binding = ActivityEditHistoryBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        imageViewQR = binding.outputQrCode;
        context =  binding.outputContext;
        date = binding.outputDate;
        delete = binding.buttonDelete;

        delete.setBackgroundColor(Color.parseColor("#FFFF0000"));

        Bundle bundle = getIntent().getExtras();

        int id = bundle.getInt("id");
        byte[] bitmap = bundle.getByteArray("image");
        Bitmap image = DbBitmapUtility.getImage(bitmap);

        imageViewQR.setImageBitmap(image);
        context.setText(bundle.getString("context"));
        date.setText(bundle.getString("date"));

        delete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                new AlertDialog.Builder(EditHistory.this)
                        .setTitle("Are you sure?")
                        .setMessage("Do you want delete?")
                        .setNegativeButton("Yes", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                deleteHistory(id);
                                finish();
                            }
                        })
                        .setPositiveButton("No", null)
                        .show();
            }
        });
    }

    private void deleteHistory(int id) {
        historyORM.deleteOne(getApplicationContext(), id);
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        return true;
    }

}