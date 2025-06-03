package com.Service;

import com.Common.Result;
import com.Entity.DTO.ScheduleDTO;
import org.springframework.stereotype.Service;

@Service
public interface schedulesService {

    /**
     * 查询排班
     * @param scheduleDTO
     * @return
     */
    public Result getSchedules(ScheduleDTO scheduleDTO);

    /**
     * 创建排班
     * @param scheduleDTO
     * @return
     */
    public Result insertSchedules(ScheduleDTO scheduleDTO);

    /**
     * 更新排班
     * @param scheduleDTO
     * @return
     */
    public Result updateSchedules(String Id,ScheduleDTO scheduleDTO);

    /**
     * 删除排班
     * @param scheduleId
     * @return
     */
    public Result deleteSchedules(String scheduleId);

    /**
     * 根据Id查询排班
     * @param scheduleId
     * @return
     */
    Result getscheduleById(String scheduleId);
}
