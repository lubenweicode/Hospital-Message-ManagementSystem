package com.Service;

import com.Common.Result;
import com.Entity.DTO.MedicineDTO;
import com.Entity.Pojo.Medicine;
import org.springframework.stereotype.Service;

@Service
public interface medicinesService {

    /**
     * 查询药品(允许条件查询)
     * @param medicineDTO
     * @return
     */
    public Result getMedicines(MedicineDTO medicineDTO);

    /**
     * 增加药品
     * @param medicine
     * @return
     */
    public Result addMedicines(Medicine medicine);

    /**
     * 删除药品
     * @param medicineId
     * @return
     */
    public Result deleteMedicines(String medicineId);

    /**
     * 更新药品
     * @param medicineId
     * @param medicineDTO
     * @return
     */
    public Result updateMedicines(String medicineId,MedicineDTO medicineDTO);

    /**
     * 根据Id查询药品
     * @param medicineId
     * @return
     */
    public Result getmedicineById(String medicineId);
}
