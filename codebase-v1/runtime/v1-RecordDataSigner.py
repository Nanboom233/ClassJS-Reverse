import json
import random
import time
from dataclasses import dataclass
from hashlib import md5
from typing import Optional

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


@dataclass
class StuStudyRecordData:
    uuid: str
    course_id: int
    file_id: int
    study_total_time: int
    start_watch_time: Optional[int] = None
    end_watch_time: Optional[int] = None
    start_date: Optional[int] = None  # unix timestamp milliseconds
    end_date: Optional[int] = None  # unix timestamp milliseconds
    signature: Optional[str] = None

    def _sign_data(self) -> None:
        sign_raw_data = "o6xpt3b#Qy$Z" + str(self.uuid) + str(self.course_id) + str(self.file_id) + str(
            self.study_total_time) + str(self.start_date) + str(self.end_date) + str(self.end_watch_time) + str(
            self.start_watch_time) + self.uuid
        self.signature = md5(sign_raw_data.encode('utf-8')).hexdigest()

    def _auto_fill_data(self) -> None:
        if not self.end_date:
            self.end_date = time.time_ns() // 1_000_000
        if not self.start_date:
            self.start_date = self.end_date - self.study_total_time * 1000 - random.randint(5, 15) * 1000
        if not self.end_watch_time:
            self.end_watch_time = self.study_total_time
        if not self.start_watch_time:
            self.start_watch_time = self.end_watch_time - self.study_total_time
            if self.start_watch_time < 0:
                self.start_watch_time = 0
                self.end_watch_time = self.study_total_time
        self._sign_data()

    def __repr__(self) -> str:
        self._auto_fill_data()

        return "StuStudyRecordData(uuid={}, courseId={}, fileId={}, studyTotalTime={}, startWatchTime={}, endWatchTime={}, startDate={}, endDate={}, signature={})".format(
            self.uuid,
            self.course_id,
            self.file_id,
            self.study_total_time,
            self.start_watch_time,
            self.end_watch_time,
            self.start_date,
            self.end_date,
            self.signature
        )

    def get_signed_data(self) -> dict:
        self._auto_fill_data()

        return {
            "uuid": self.uuid,
            "courseId": self.course_id,
            "fileId": self.file_id,
            "studyTotalTime": self.study_total_time,
            "startWatchTime": self.start_watch_time,
            "endWatchTime": self.end_watch_time,
            "startDate": self.start_date,
            "endDate": self.end_date,
            "signature": self.signature,
            "_": time.time_ns() // 1_000_000  # current_time to simulate real packet
        }


def get_course_list(uuid: str, course_id: int) -> list[dict]:
    def _unpack_course_list(raw_dict: dict, save_list: list[dict], father_name: str = "") -> None:
        if "childList" in raw_dict and raw_dict["childList"]:
            for child in raw_dict["childList"]:
                _unpack_course_list(child, save_list, father_name + raw_dict.get("name", "") + " > ")
        else:
            save_list.append({
                "name": father_name + raw_dict.get("name"),
                "mustLearn": raw_dict.get("mustLearn"),
                "totalTime": raw_dict.get("totalTime"),
                "studyTime": raw_dict.get("studyTime"),
                "fileId": raw_dict.get("id")
            })

    BASE_URL = "https://studyresources.zhihuishu.com/studyResources/stuResouce/queryResourceTree"
    with open("course-list-headers.json", "r", encoding="utf-8") as f:
        HEADERS = json.load(f)
    response = requests.get(
        url=BASE_URL,
        params={
            "uuid": uuid,
            "courseId": course_id,
            "dateFormate": time.time_ns() // 1_000_000
        },
        headers=HEADERS,
        verify=False
    )
    if not response.ok:
        print("Failed to get course list, status code:", response.status_code)
        raise Exception("Failed to get course list")
    raw_list = response.json().get("rt", [{}])[0]
    course_list = []
    _unpack_course_list(raw_list, course_list)
    return course_list


def main():
    uuid = "EQAgQbje"
    courseId = 11461061
    course_list = get_course_list(uuid, courseId)

    for course in course_list:
        if course["mustLearn"] and course["studyTime"] < course["totalTime"]:
            needed_rt = course["totalTime"] - course["studyTime"]
            print(f"Recording study session for {course['name']}: {needed_rt} seconds")
            while needed_rt > 0:
                session_rt = min(needed_rt, random.randint(12, 30))
                record_data = StuStudyRecordData(
                    uuid=uuid,
                    course_id=courseId,
                    file_id=course["fileId"],
                    study_total_time=session_rt
                )
                with open("hike-headers.json", "r", encoding="utf-8") as f:
                    HEADERS = json.load(f)
                BASE_URL = "https://hike-teaching.zhihuishu.com/stuStudy/saveStuStudyRecord"
                response = requests.get(
                    url=BASE_URL,
                    params=record_data.get_signed_data(),
                    headers=HEADERS,
                    verify=False
                )
                print(response.text)
                needed_rt -= session_rt
    pass


if __name__ == "__main__":
    main()
