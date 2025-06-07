package com.Service;

import com.Common.Result;
import com.Entity.DTO.MedicineDTO;
import com.Entity.DTO.OrderDTO;
import com.Entity.Pojo.Medicine;
import org.springframework.stereotype.Service;

@Service
public interface medicinesService {

    /**
     * 查询药品(允许条件查询)
     * @param medicineDTO
     * @return
     */
    Result getMedicines(MedicineDTO medicineDTO);

    /**
     * 增加药品
     * @param medicine
     * @return
     */
    Result addMedicines(Medicine medicine);

    /**
     * 删除药品
     * @param medicineId
     * @return
     */
    Result deleteMedicines(String medicineId);

    /**
     * 更新药品
     * @param medicineId
     * @param medicineDTO
     * @return
     */
    Result updateMedicines(String medicineId, MedicineDTO medicineDTO);

    /**
     * 根据Id查询药品
     * @param medicineId
     * @return
     */
    Result getmedicineById(String medicineId);

    /**
     * 药品下单
     * @param orderDTO
     * @return
     */
    Result orderMedicines(OrderDTO orderDTO);
}
