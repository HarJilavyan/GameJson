import json
import datetime
import os
import subprocess

file_path = "temp/temp.json"

def validation_func(file_path):
    error_list = []
    unique_uuids = set()
    unique_cads = set()
    unique_codes = set()
    unique_codes_community = set()
    unique_codes_residence = set()


    with open(file = file_path, mode = "r") as read_file:
        object = json.load(read_file)
        data = object["data"]
        for idx, item in enumerate(data):
            unit_names = item["unit_names"]
            classifier_codes = item["classifier_codes"]
            parrent_units = item["parent_units"]
            uuid = item["uuid"]
            cad_code = item["cadastral_code"]
            type_id = item["type_id"]
            if type_id != "region":
                last_parrent_units = parrent_units[-1]
            if uuid not in unique_uuids:
                unique_uuids.add(uuid)
            else:
                # print(f"In index {idx} this uuid {uuid} is duplicate,\n")
                error_list.append(f"In index {idx} this uuid {uuid} is duplicate,\n")
            if type_id == "community" and cad_code != "":
                # print(f"In index {idx} cadastral code should not exist,\n")
                error_list.append(f"In index {idx} cadastral code should not exist,\n")
                # if cad_code == "":
                #     continue
                # else:    
            elif type_id == "residence":
                if cad_code == "":
                    # print(f"In index {idx} the cadastral code for this {uuid} is missing,\n")
                    error_list.append(f"In index {idx} the cadastral code for this {uuid} is missing,\n")

                else:
                    if cad_code not in unique_cads:
                        unique_cads.add(cad_code)
                    else:
                        # print(f"In index {idx} this cadastral code {cad_code} for this uuid {uuid} is duplicate,\n")
                        error_list.append(f"In index {idx} this cadastral code {cad_code} for this uuid {uuid} is duplicate,\n")
            try:
                if type_id != "region":
                    if last_parrent_units["end_date"] != "":
                        check_unit_names = item["unit_names"]
                        check_class_codes = item["classifier_codes"]

                        if check_unit_names[-1]['end_date'] == "" or check_class_codes[-1]['end_date'] == "":
                            # print(f"In index {idx} parrent uuid {parrent_uuid} has end date but unit names and classifier codes don't")
                            error_list.append(f"In index {idx} parrent uuid {parrent_uuid} has end date but unit names and classifier codes don't")
            except Exception as ex:
                # print(f"In index {idx} the exception {ex},\n")
                error_list.append(f"In index {idx} the exception {ex},\n")

            try:
                for unit in unit_names + classifier_codes + parrent_units:
                    start_date = unit["start_date"]
                    end_date = unit["end_date"]
                    if start_date and end_date and start_date > end_date:
                        # print(f"In index {idx} wrong position of dates for uuid {uuid},\n")
                        error_list.append(f"In index {idx} wrong position of dates for uuid {uuid},\n")
            except Exception as ex:
                # print(f"In {idx} the exception {ex},\n")
                error_list.append(f"In index {idx} wrong position of dates for uuid {uuid},\n")

            codes = item["classifier_codes"]
            if type_id == "community":
                for i in codes:
                    code = i["code"]
                    if code not in unique_codes_community:
                        unique_codes_community.add(code)
                    elif not(len(code) <= 8 and len(code) >= 7):
                        # print(f"In index {idx} this code{code} is too long")
                        error_list.append(f"In index {idx} this code{code} is too long")
                    else:
                        # print(f"In index {idx} this code {code} is duplicate,\n")
                        error_list.append(f"In index {idx} this code {code} is duplicate,\n")
            elif type_id == "residence":
                for i in codes:
                    code = i["code"]
                    if code not in unique_codes_residence:
                        unique_codes_residence.add(code)
                    elif not(len(code) <= 8 and len(code) >= 7):
                        # print(f"In index {idx} this code{code} is too long")
                        error_list.append(f"In index {idx} this code{code} is too long")
                    else:
                        # print(f"In index {idx} this code {code} is duplicate,\n")
                        error_list.append(f"In index {idx} this code {code} is duplicate,\n")
                        
            # for i in codes:
            #     code = i["code"]
            #     if code not in unique_codes:
            #         unique_codes.add(code)
            #     elif not(len(code) <= 8 and len(code) >= 7):
            #         print(f"In index {idx} this code{code} is too long")
            #     else:
            #         print(f"In index {idx} this code {code} is duplicate,\n")
            
            try:
                for p1 in parrent_units:
                    parrent_uuid = p1["parent_uuid"]
                    if parrent_uuid not in unique_uuids:
                        # print(f"In index {idx} parrent uuid {parrent_uuid} missing for the uuid {uuid} ,\n")
                        error_list.append(f"In index {idx} parrent uuid {parrent_uuid} missing for the uuid {uuid} ,\n")
            except Exception as ex:
                # print(f"In index {idx} the exception {ex},\n")
                error_list.append(f"In index {idx} parrent uuid {parrent_uuid} missing for the uuid {uuid} ,\n")
    return error_list


    