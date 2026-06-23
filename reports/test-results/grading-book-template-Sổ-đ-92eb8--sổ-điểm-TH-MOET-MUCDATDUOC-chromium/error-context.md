# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: grading-book-template.test.ts >> Sổ điểm mẫu - Subject Grading Book Templates >> TC_SGBT_009 - Kiểm tra chi tiết từng cột của sổ điểm TH_MOET_MUCDATDUOC
- Location: tests\grading-book-template.test.ts:155:7

# Error details

```
Error: gradingMechanism phải là "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học"

expect(locator).toHaveValue(expected) failed

Locator: locator('dx-select-box[itemtemplate="item"] .dx-texteditor-input').first()
Expected: "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học"
Timeout: 15000ms
Error: element(s) not found

Call log:
  - gradingMechanism phải là "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" with timeout 15000ms
  - waiting for locator('dx-select-box[itemtemplate="item"] .dx-texteditor-input').first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e7]:
    - generic [ref=e9]:
      - link [ref=e12] [cursor=pointer]:
        - /url: /
      - navigation [ref=e15]:
        - generic [ref=e16]:
          - link [ref=e18] [cursor=pointer]:
            - /url: /
          - generic [ref=e21] [cursor=pointer]: 
        - list [ref=e23]:
          - listitem [ref=e24]:
            - link "Home" [ref=e26] [cursor=pointer]:
              - /url: /
              - generic [ref=e28]: 
              - generic [ref=e29]: Home
          - listitem [ref=e30]:
            - generic [ref=e31]:
              - generic [ref=e32] [cursor=pointer]:
                - generic [ref=e34]: 
                - generic [ref=e35]: School management
                - generic [ref=e37]: 
              - text:    
          - listitem [ref=e38]:
            - generic [ref=e39]:
              - generic [ref=e40] [cursor=pointer]:
                - generic [ref=e42]: 
                - generic [ref=e43]: Students
                - generic [ref=e45]: 
              - text:   
          - listitem [ref=e46]:
            - generic [ref=e48] [cursor=pointer]:
              - generic [ref=e50]: 
              - generic [ref=e51]: Class record book
              - generic [ref=e53]: 
          - listitem [ref=e54]:
            - generic [ref=e56] [cursor=pointer]:
              - generic [ref=e58]: 
              - generic [ref=e59]: Contact managements
              - generic [ref=e61]: 
          - listitem [ref=e62]:
            - generic [ref=e63]:
              - generic [ref=e64] [cursor=pointer]:
                - generic [ref=e66]: 
                - generic [ref=e67]: Faculties
                - generic [ref=e69]: 
              - text: 
          - listitem [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72] [cursor=pointer]:
                - generic [ref=e74]: 
                - generic [ref=e75]: Gradebook
                - generic [ref=e77]: 
              - list [ref=e78]:
                - listitem [ref=e79]:
                  - generic [ref=e80]:
                    - generic [ref=e81] [cursor=pointer]:
                      - generic [ref=e82]: Gradebook management
                      - generic [ref=e84]: 
                    - list [ref=e85]:
                      - listitem [ref=e86]:
                        - link "Grading schemes" [ref=e88] [cursor=pointer]:
                          - /url: /grading-schemes
                          - generic [ref=e89]: Grading schemes
                      - listitem [ref=e90]:
                        - link "Subject gradebook templates" [ref=e92] [cursor=pointer]:
                          - /url: /subject-grading-book-templates
                          - generic [ref=e93]: Subject gradebook templates
                      - listitem [ref=e94]:
                        - link "Total gradebook template config" [ref=e96] [cursor=pointer]:
                          - /url: /total-grading-book-templates
                          - generic [ref=e97]: Total gradebook template config
                      - listitem [ref=e98]:
                        - link "Subject gradebook list" [ref=e100] [cursor=pointer]:
                          - /url: /subject-grading-book-views
                          - generic [ref=e101]: Subject gradebook list
                      - listitem [ref=e102]:
                        - link "Total gradebook list" [ref=e104] [cursor=pointer]:
                          - /url: /total-grading-books
                          - generic [ref=e105]: Total gradebook list
                      - listitem [ref=e106]:
                        - link "Total gradebook (new)" [ref=e108] [cursor=pointer]:
                          - /url: /total-grading-book-views
                          - generic [ref=e109]: Total gradebook (new)
                - listitem [ref=e110]:
                  - link "Gradebook semester locking" [ref=e112] [cursor=pointer]:
                    - /url: /gradebook-semester-lockings
                    - generic [ref=e113]: Gradebook semester locking
                - listitem [ref=e114]:
                  - link "Teacher Gradebook" [ref=e116] [cursor=pointer]:
                    - /url: /reference-gradebook-by-courses
                    - generic [ref=e117]: Teacher Gradebook
                - listitem [ref=e118]:
                  - link "Subject's scores - comments" [ref=e120] [cursor=pointer]:
                    - /url: /subject-score-gradebook-by-course
                    - generic [ref=e121]: Subject's scores - comments
                - listitem [ref=e122]:
                  - link "Total scores" [ref=e124] [cursor=pointer]:
                    - /url: /total-scores
                    - generic [ref=e125]: Total scores
                - listitem [ref=e126]:
                  - link "Average scores" [ref=e128] [cursor=pointer]:
                    - /url: /average-scores
                    - generic [ref=e129]: Average scores
          - listitem [ref=e130]:
            - generic [ref=e132] [cursor=pointer]:
              - generic [ref=e134]: 
              - generic [ref=e135]: Timetables
              - generic [ref=e137]: 
          - listitem [ref=e138]:
            - generic [ref=e139]:
              - generic [ref=e140] [cursor=pointer]:
                - generic [ref=e142]: 
                - generic [ref=e143]: Data export
                - generic [ref=e145]: 
              - text: 
          - listitem [ref=e146]:
            - generic [ref=e148] [cursor=pointer]:
              - generic [ref=e150]: 
              - generic [ref=e151]: Learning report
              - generic [ref=e153]: 
          - listitem [ref=e154]:
            - generic [ref=e156] [cursor=pointer]:
              - generic [ref=e158]: 
              - generic [ref=e159]: Canvas LMS Integration
              - generic [ref=e161]: 
          - listitem [ref=e162]:
            - link "Class Promotion Batch" [ref=e164] [cursor=pointer]:
              - /url: /student-transfer-batches
              - generic [ref=e166]: 
              - generic [ref=e167]: Class Promotion Batch
          - listitem [ref=e168]:
            - generic [ref=e169]:
              - generic [ref=e170] [cursor=pointer]:
                - generic [ref=e172]: 
                - generic [ref=e173]: Class attendances
                - generic [ref=e175]: 
              - text: 
          - listitem [ref=e176]:
            - generic [ref=e177]:
              - generic [ref=e178] [cursor=pointer]:
                - generic [ref=e180]: 
                - generic [ref=e181]: Health management
                - generic [ref=e183]: 
              - text: 
          - listitem [ref=e184]:
            - generic [ref=e185]:
              - generic [ref=e186] [cursor=pointer]:
                - generic [ref=e188]: 
                - generic [ref=e189]: Kỷ luật và khen thưởng
                - generic [ref=e191]: 
              - text: 
          - listitem [ref=e192]:
            - generic [ref=e194] [cursor=pointer]:
              - generic [ref=e196]: 
              - generic [ref=e197]: News management
              - generic [ref=e199]: 
          - listitem [ref=e200]:
            - link "Menus" [ref=e202] [cursor=pointer]:
              - /url: /school-menus
              - generic [ref=e204]: 
              - generic [ref=e205]: Menus
          - listitem [ref=e206]:
            - generic [ref=e207]:
              - generic [ref=e208] [cursor=pointer]:
                - generic [ref=e210]: 
                - generic [ref=e211]: Administration
                - generic [ref=e213]: 
              - text:                         
    - generic [ref=e214]:
      - generic [ref=e216]:
        - navigation "breadcrumb" [ref=e219]:
          - list [ref=e220]:
            - listitem [ref=e221] [cursor=pointer]:
              - generic [ref=e223]: 
              - text: Home
        - generic [ref=e224]:
          - generic [ref=e226]:
            - generic [ref=e227]:
              - generic [ref=e228]: Campus
              - button "Phuong_Test" [ref=e229] [cursor=pointer]
            - generic [ref=e230]:
              - generic [ref=e231]: School years
              - button "2026-2027" [ref=e232] [cursor=pointer]
            - generic [ref=e233]:
              - generic [ref=e234]: Language
              - button "English" [ref=e235] [cursor=pointer]
            - generic [ref=e238] [cursor=pointer]:
              - generic [ref=e239]: 
              - generic [ref=e240]: "3"
          - generic [ref=e243]:
            - generic [ref=e245]: 
            - button "PhuongAdmin" [ref=e246] [cursor=pointer]
      - generic [ref=e249]:
        - form [ref=e253]:
          - generic [ref=e254]:
            - heading "Subject gradebook template - Update" [level=4] [ref=e256]
            - form [ref=e260]:
              - generic [ref=e265]:
                - group [ref=e270]:
                  - generic [ref=e277]:
                    - generic [ref=e279]: "Code: *"
                    - textbox [ref=e285]: TH_MOET_MUCDATDUOC
                - group [ref=e290]:
                  - generic [ref=e297]:
                    - generic [ref=e299]: "Name: *"
                    - 'textbox "Name: *" [ref=e304]': Sổ điểm MOET - Tiểu học - Đánh giá theo mức đạt được
                - group [ref=e309]:
                  - generic [ref=e316]:
                    - generic [ref=e318]: "Report name:"
                    - textbox "Report name:" [ref=e323]
            - generic [ref=e324]:
              - button "Save" [ref=e325] [cursor=pointer]:
                - generic [ref=e326]:
                  - generic [ref=e327]: 
                  - generic [ref=e328]: Save
              - button "Close" [ref=e329] [cursor=pointer]:
                - generic [ref=e331]: Close
              - button "Undo changes" [ref=e332] [cursor=pointer]:
                - generic [ref=e334]: Undo changes
        - generic [ref=e337]:
          - heading "Grade items - Sổ điểm MOET - Tiểu học - Đánh giá theo mức đạt được" [level=5] [ref=e339]
          - group "Tree list with 12 rows and 9 columns" [ref=e340]:
            - row "Column Grade item name":
              - columnheader "Column Grade item name" [ref=e342] [cursor=pointer]:
                - generic [ref=e343]:
                  - text: Grade item name
                  - generic [ref=e346]: 
            - row "Column Grade item code Column Weight Column Grading scheme Column Semester Column Grading type Column Is final score Column Is sync Column Line number" [ref=e357]:
              - columnheader "Column Grade item code" [ref=e358] [cursor=pointer]: Grade item code
              - columnheader "Column Weight" [ref=e359] [cursor=pointer]: Weight
              - columnheader "Column Grading scheme" [ref=e360] [cursor=pointer]: Grading scheme
              - columnheader "Column Semester" [ref=e361] [cursor=pointer]: Semester
              - columnheader "Column Grading type" [ref=e362] [cursor=pointer]: Grading type
              - columnheader "Column Is final score" [ref=e363] [cursor=pointer]: Is final score
              - columnheader "Column Is sync" [ref=e364] [cursor=pointer]: Is sync
              - columnheader "Column Line number" [ref=e365] [cursor=pointer]: Line number
            - treegrid [ref=e369]:
              - row "CN 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học Calculation" [expanded] [level=1] [ref=e380]:
                - gridcell "CN" [ref=e381]:
                  - generic [ref=e382]: CN
                - gridcell "0" [ref=e383]:
                  - generic [ref=e384]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e385]
                - gridcell [ref=e386]
                - gridcell "Calculation" [ref=e387]
                - gridcell [ref=e388]:
                  - checkbox [ref=e389]
                - gridcell [ref=e392]:
                  - checkbox [ref=e393]
                - gridcell [ref=e396]
              - row "HK1 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK1 Calculation" [expanded] [level=2] [ref=e397]:
                - gridcell "HK1" [ref=e398]:
                  - generic [ref=e399]: HK1
                - gridcell "0" [ref=e400]:
                  - generic [ref=e401]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e402]
                - gridcell "HK1" [ref=e403]
                - gridcell "Calculation" [ref=e404]
                - gridcell [ref=e405]:
                  - checkbox [ref=e406]
                - gridcell [ref=e409]:
                  - checkbox [ref=e410]
                - gridcell [ref=e413]
              - row "MDDGK1 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK1 Normal " [level=3] [ref=e414]:
                - gridcell "MDDGK1" [ref=e415]:
                  - generic [ref=e416]: MDDGK1
                - gridcell "0" [ref=e417]:
                  - generic [ref=e418]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e419]
                - gridcell "HK1" [ref=e420]
                - gridcell "Normal" [ref=e421]
                - gridcell [ref=e422]:
                  - checkbox [ref=e423]
                - gridcell "" [ref=e426]:
                  - checkbox "" [checked] [ref=e427]:
                    - generic [ref=e429]: 
                - gridcell [ref=e430]
              - row "NXGK1 HK1 Comment" [level=3] [ref=e431]:
                - gridcell "NXGK1" [ref=e432]:
                  - generic [ref=e433]: NXGK1
                - gridcell [ref=e434]
                - gridcell [ref=e435]
                - gridcell "HK1" [ref=e436]
                - gridcell "Comment" [ref=e437]
                - gridcell [ref=e438]:
                  - checkbox [ref=e439]
                - gridcell [ref=e442]:
                  - checkbox [ref=e443]
                - gridcell [ref=e446]
              - row "MDDCK1 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK1 Normal " [level=3] [ref=e447]:
                - gridcell "MDDCK1" [ref=e448]:
                  - generic [ref=e449]: MDDCK1
                - gridcell "0" [ref=e450]:
                  - generic [ref=e451]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e452]
                - gridcell "HK1" [ref=e453]
                - gridcell "Normal" [ref=e454]
                - gridcell [ref=e455]:
                  - checkbox [ref=e456]
                - gridcell "" [ref=e459]:
                  - checkbox "" [checked] [ref=e460]:
                    - generic [ref=e462]: 
                - gridcell [ref=e463]
              - row "NXCK1 HK1 Comment" [level=3] [ref=e464]:
                - gridcell "NXCK1" [ref=e465]:
                  - generic [ref=e466]: NXCK1
                - gridcell [ref=e467]
                - gridcell [ref=e468]
                - gridcell "HK1" [ref=e469]
                - gridcell "Comment" [ref=e470]
                - gridcell [ref=e471]:
                  - checkbox [ref=e472]
                - gridcell [ref=e475]:
                  - checkbox [ref=e476]
                - gridcell [ref=e479]
              - row "HK2 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK2 Calculation" [expanded] [level=2] [ref=e480]:
                - gridcell "HK2" [ref=e481]:
                  - generic [ref=e482]: HK2
                - gridcell "0" [ref=e483]:
                  - generic [ref=e484]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e485]
                - gridcell "HK2" [ref=e486]
                - gridcell "Calculation" [ref=e487]
                - gridcell [ref=e488]:
                  - checkbox [ref=e489]
                - gridcell [ref=e492]:
                  - checkbox [ref=e493]
                - gridcell [ref=e496]
              - row "MDDGK2 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK2 Normal " [level=3] [ref=e497]:
                - gridcell "MDDGK2" [ref=e498]:
                  - generic [ref=e499]: MDDGK2
                - gridcell "0" [ref=e500]:
                  - generic [ref=e501]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e502]
                - gridcell "HK2" [ref=e503]
                - gridcell "Normal" [ref=e504]
                - gridcell [ref=e505]:
                  - checkbox [ref=e506]
                - gridcell "" [ref=e509]:
                  - checkbox "" [checked] [ref=e510]:
                    - generic [ref=e512]: 
                - gridcell [ref=e513]
              - row "NXGK2 HK2 Comment" [level=3] [ref=e514]:
                - gridcell "NXGK2" [ref=e515]:
                  - generic [ref=e516]: NXGK2
                - gridcell [ref=e517]
                - gridcell [ref=e518]
                - gridcell "HK2" [ref=e519]
                - gridcell "Comment" [ref=e520]
                - gridcell [ref=e521]:
                  - checkbox [ref=e522]
                - gridcell [ref=e525]:
                  - checkbox [ref=e526]
                - gridcell [ref=e529]
              - row "MDDCK2 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK2 Normal " [level=3] [ref=e530]:
                - gridcell "MDDCK2" [ref=e531]:
                  - generic [ref=e532]: MDDCK2
                - gridcell "0" [ref=e533]:
                  - generic [ref=e534]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e535]
                - gridcell "HK2" [ref=e536]
                - gridcell "Normal" [ref=e537]
                - gridcell [ref=e538]:
                  - checkbox [ref=e539]
                - gridcell "" [ref=e542]:
                  - checkbox "" [checked] [ref=e543]:
                    - generic [ref=e545]: 
                - gridcell [ref=e546]
              - row "NXCK2 HK2 Comment" [level=3] [ref=e547]:
                - gridcell "NXCK2" [ref=e548]:
                  - generic [ref=e549]: NXCK2
                - gridcell [ref=e550]
                - gridcell [ref=e551]
                - gridcell "HK2" [ref=e552]
                - gridcell "Comment" [ref=e553]
                - gridcell [ref=e554]:
                  - checkbox [ref=e555]
                - gridcell [ref=e558]:
                  - checkbox [ref=e559]
                - gridcell [ref=e562]
              - row "TL 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học Normal" [level=1] [ref=e563]:
                - gridcell "TL" [ref=e564]:
                  - generic [ref=e565]: TL
                - gridcell "0" [ref=e566]:
                  - generic [ref=e567]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e568]
                - gridcell [ref=e569]
                - gridcell "Normal" [ref=e570]
                - gridcell [ref=e571]:
                  - checkbox [ref=e572]
                - gridcell [ref=e575]:
                  - checkbox [ref=e576]
                - gridcell [ref=e579]
            - treegrid:
              - row " Cuối năm  " [expanded] [level=1]:
                - gridcell " Cuối năm  " [ref=e583]:
                  - generic [ref=e585]:
                    - generic: 
                  - generic [ref=e587]:
                    - generic [ref=e588]: Cuối năm
                    - generic [ref=e590]:
                      - generic [ref=e593] [cursor=pointer]: 
                      - img [ref=e596] [cursor=pointer]
                      - generic [ref=e602] [cursor=pointer]: 
              - row " Học kỳ 1  " [expanded] [level=2]:
                - gridcell " Học kỳ 1  " [ref=e603]:
                  - generic [ref=e606]:
                    - generic: 
                  - generic [ref=e608]:
                    - generic [ref=e609]: Học kỳ 1
                    - generic [ref=e611]:
                      - generic [ref=e614] [cursor=pointer]: 
                      - img [ref=e617] [cursor=pointer]
                      - generic [ref=e623] [cursor=pointer]: 
              - row "Mức đạt được - GK1  " [level=3]:
                - gridcell "Mức đạt được - GK1  " [ref=e624]:
                  - generic [ref=e630]:
                    - generic [ref=e631]: Mức đạt được - GK1
                    - generic [ref=e633]:
                      - generic [ref=e636] [cursor=pointer]: 
                      - img [ref=e639] [cursor=pointer]
                      - generic [ref=e645] [cursor=pointer]: 
              - row "Nhận xét giữa kì 1  " [level=3]:
                - gridcell "Nhận xét giữa kì 1  " [ref=e646]:
                  - generic [ref=e652]:
                    - generic [ref=e653]: Nhận xét giữa kì 1
                    - generic [ref=e655]:
                      - generic [ref=e658] [cursor=pointer]: 
                      - img [ref=e661] [cursor=pointer]
                      - generic [ref=e667] [cursor=pointer]: 
              - row "Mức đạt được - CK1  " [level=3]:
                - gridcell "Mức đạt được - CK1  " [ref=e668]:
                  - generic [ref=e674]:
                    - generic [ref=e675]: Mức đạt được - CK1
                    - generic [ref=e677]:
                      - generic [ref=e680] [cursor=pointer]: 
                      - img [ref=e683] [cursor=pointer]
                      - generic [ref=e689] [cursor=pointer]: 
              - row "Nhận xét cuối kì 1  " [level=3]:
                - gridcell "Nhận xét cuối kì 1  " [ref=e690]:
                  - generic [ref=e696]:
                    - generic [ref=e697]: Nhận xét cuối kì 1
                    - generic [ref=e699]:
                      - generic [ref=e702] [cursor=pointer]: 
                      - img [ref=e705] [cursor=pointer]
                      - generic [ref=e711] [cursor=pointer]: 
              - row " Học kỳ 2  " [expanded] [level=2]:
                - gridcell " Học kỳ 2  " [ref=e712]:
                  - generic [ref=e715]:
                    - generic: 
                  - generic [ref=e717]:
                    - generic [ref=e718]: Học kỳ 2
                    - generic [ref=e720]:
                      - generic [ref=e723] [cursor=pointer]: 
                      - img [ref=e726] [cursor=pointer]
                      - generic [ref=e732] [cursor=pointer]: 
              - row "Mức đạt được - GK2  " [level=3]:
                - gridcell "Mức đạt được - GK2  " [ref=e733]:
                  - generic [ref=e739]:
                    - generic [ref=e740]: Mức đạt được - GK2
                    - generic [ref=e742]:
                      - generic [ref=e745] [cursor=pointer]: 
                      - img [ref=e748] [cursor=pointer]
                      - generic [ref=e754] [cursor=pointer]: 
              - row "Nhận xét giữa kì 2  " [level=3]:
                - gridcell "Nhận xét giữa kì 2  " [ref=e755]:
                  - generic [ref=e761]:
                    - generic [ref=e762]: Nhận xét giữa kì 2
                    - generic [ref=e764]:
                      - generic [ref=e767] [cursor=pointer]: 
                      - img [ref=e770] [cursor=pointer]
                      - generic [ref=e776] [cursor=pointer]: 
              - row "Mức đạt được - CK2  " [level=3]:
                - gridcell "Mức đạt được - CK2  " [ref=e777]:
                  - generic [ref=e783]:
                    - generic [ref=e784]: Mức đạt được - CK2
                    - generic [ref=e786]:
                      - generic [ref=e789] [cursor=pointer]: 
                      - img [ref=e792] [cursor=pointer]
                      - generic [ref=e798] [cursor=pointer]: 
              - row "Nhận xét cuối kì 2  " [level=3]:
                - gridcell "Nhận xét cuối kì 2  " [ref=e799]:
                  - generic [ref=e805]:
                    - generic [ref=e806]: Nhận xét cuối kì 2
                    - generic [ref=e808]:
                      - generic [ref=e811] [cursor=pointer]: 
                      - img [ref=e814] [cursor=pointer]
                      - generic [ref=e820] [cursor=pointer]: 
              - row "Thi lại  " [level=1]:
                - gridcell "Thi lại  " [ref=e821]:
                  - generic [ref=e825]:
                    - generic [ref=e826]: Thi lại
                    - generic [ref=e828]:
                      - generic [ref=e831] [cursor=pointer]: 
                      - img [ref=e834] [cursor=pointer]
                      - generic [ref=e840] [cursor=pointer]: 
  - dialog "Grade item - Update" [active] [ref=e842]:
    - toolbar [ref=e843]:
      - generic [ref=e847]: Grade item - Update
    - generic [ref=e850]:
      - form [ref=e853]:
        - group [ref=e861]:
          - generic [ref=e865]:
            - group [ref=e870]:
              - generic [ref=e874]:
                - generic [ref=e880]:
                  - generic [ref=e881]: 
                  - text: General infor 
                - generic [ref=e883]:
                  - group [ref=e888]:
                    - generic [ref=e892]:
                      - generic [ref=e895]:
                        - generic [ref=e897]: "Semester:"
                        - generic [ref=e901] [cursor=pointer]:
                          - generic [ref=e902]:
                            - combobox "Select..." [ref=e903]: Học kỳ 2
                            - text: Select...
                          - generic [ref=e904]:
                            - generic [ref=e906]: 
                            - button "Select" [ref=e907]:
                              - generic [ref=e909]: 
                      - generic [ref=e912]:
                        - generic [ref=e914]: "Grade item code: *"
                        - 'textbox "Grade item code: *" [ref=e919]': MDDGK2
                      - generic [ref=e922]:
                        - generic [ref=e924]: "Report name:"
                        - textbox "Report name:" [ref=e929]
                  - group [ref=e934]:
                    - generic [ref=e938]:
                      - generic [ref=e941]:
                        - generic [ref=e943]: "Parent:"
                        - generic [ref=e944]:
                          - generic:
                            - generic:
                              - generic:
                                - generic:
                                  - combobox "Select..." [disabled]: Học kỳ 2
                                  - text: Select...
                                - generic:
                                  - button "Select":
                                    - generic:
                                      - generic: 
                      - generic [ref=e947]:
                        - generic [ref=e949]: "Grade item name: *"
                        - 'textbox "Grade item name: *" [ref=e954]': Mức đạt được - GK2
            - group [ref=e959]:
              - generic [ref=e963]:
                - generic [ref=e969]:
                  - generic [ref=e970]: 
                  - text: Formula and calculation
                - group [ref=e975]:
                  - generic [ref=e981]:
                    - generic [ref=e984]:
                      - generic [ref=e986]: "Grading type:"
                      - generic [ref=e987]:
                        - generic:
                          - generic:
                            - generic:
                              - generic:
                                - combobox "Select..." [disabled]: Normal
                                - text: Select...
                              - generic:
                                - button "Select":
                                  - generic:
                                    - generic: 
                    - generic [ref=e990]:
                      - generic [ref=e992]: "Weight: *"
                      - generic [ref=e994]:
                        - spinbutton [ref=e998]: "0"
                        - button "Score" [ref=e999] [cursor=pointer]:
                          - generic [ref=e1002]:
                            - generic [ref=e1003]: "%"
                            - generic [ref=e1005]: Score
                - generic [ref=e1008]:
                  - generic:
                    - group
                - generic [ref=e1011]:
                  - generic:
                    - group
                - group [ref=e1016]:
                  - group [ref=e1025]:
                    - generic [ref=e1031]:
                      - generic [ref=e1034]:
                        - generic [ref=e1036]: "Input or excel import:"
                        - checkbox "" [checked] [ref=e1039] [cursor=pointer]:
                          - generic [ref=e1041]: 
                      - generic [ref=e1044]:
                        - generic [ref=e1046]: "Select from teacher gradebook:"
                        - checkbox "" [checked] [ref=e1049] [cursor=pointer]:
                          - generic [ref=e1051]: 
            - group [ref=e1058]:
              - generic [ref=e1062]:
                - generic [ref=e1068]:
                  - generic [ref=e1069]: 
                  - text: Display configuration
                - generic [ref=e1072]:
                  - generic:
                    - group
                - group [ref=e1077]:
                  - group [ref=e1086]:
                    - generic [ref=e1093]:
                      - generic [ref=e1095]: "Is rounded:"
                      - button "OFF" [ref=e1098] [cursor=pointer]:
                        - generic [ref=e1101]:
                          - generic [ref=e1102]: "ON"
                          - generic [ref=e1104]: "OFF"
                - group [ref=e1109]:
                  - generic [ref=e1115]:
                    - generic [ref=e1118]:
                      - generic [ref=e1120]: "Is display on total score gradebook:"
                      - checkbox "Is display on total score gradebook:" [ref=e1122] [cursor=pointer]
                    - generic [ref=e1127]:
                      - generic [ref=e1129]: "Line number:"
                      - spinbutton [ref=e1135]
                - group [ref=e1140]:
                  - generic [ref=e1147]:
                    - generic [ref=e1149]: "Is sync:"
                    - checkbox "" [checked] [ref=e1152] [cursor=pointer]:
                      - generic [ref=e1154]: 
      - generic [ref=e1156]:
        - button "Save" [ref=e1157] [cursor=pointer]:
          - generic [ref=e1158]:
            - generic [ref=e1159]: 
            - generic [ref=e1160]: Save
        - button "Close" [ref=e1161] [cursor=pointer]:
          - generic [ref=e1163]: Close
```

# Test source

```ts
  567 |     } else {
  568 |       await expect(
  569 |         this.columnDetailPage.parentValue(),
  570 |         `parent phải là "${col.parentGroup}"`
  571 |       ).toHaveValue(col.parentGroup, { timeout: TIMEOUTS.MEDIUM });
  572 |     }
  573 |   }
  574 | 
  575 |   async assertColumnDetailCode(col: ColumnConfig): Promise<void> {
  576 |     this.logger.step(`  Assert code = "${col.code}"`);
  577 |     await this.highlightField(this.columnDetailPage.codeValue());
  578 |     await expect(
  579 |       this.columnDetailPage.codeValue(),
  580 |       `code phải là "${col.code}"`
  581 |     ).toHaveValue(col.code, { timeout: TIMEOUTS.MEDIUM });
  582 |   }
  583 | 
  584 |   async assertColumnDetailName(col: ColumnConfig): Promise<void> {
  585 |     this.logger.step(`  Assert name = "${col.name}"`);
  586 |     await this.highlightField(this.columnDetailPage.nameValue());
  587 |     await expect(
  588 |       this.columnDetailPage.nameValue(),
  589 |       `name phải là "${col.name}"`
  590 |     ).toHaveValue(col.name, { timeout: TIMEOUTS.MEDIUM });
  591 |   }
  592 | 
  593 |   async assertColumnDetailReportName(col: ColumnConfig): Promise<void> {
  594 |     if (col.reportName !== undefined) {
  595 |       this.logger.step(`  Assert reportName = "${col.reportName}"`);
  596 |       await this.highlightField(this.columnDetailPage.reportNameValue());
  597 |       const actualReportName = await this.columnDetailPage.getReportNameValue();
  598 |       expect(actualReportName, `reportName phải là "${col.reportName}"`).toBe(col.reportName);
  599 |     } else {
  600 |       this.logger.step(`  Skip assert reportName (không có trong test data)`);
  601 |     }
  602 |   }
  603 | 
  604 |   async assertColumnDetailGradingType(col: ColumnConfig): Promise<void> {
  605 |     const expectedGradingTypeVal = GRADING_TYPE_VALUE[col.gradingType];
  606 |     this.logger.step(`  Assert gradingType = "${col.gradingType}" (value="${expectedGradingTypeVal}")`);
  607 |     await this.highlightField(this.columnDetailPage.gradingTypeValue("Grading type:"));
  608 |     await expect(
  609 |       this.columnDetailPage.gradingTypeValue("Grading type:"),
  610 |       `gradingType "${col.gradingType}" phải có attribute value="${expectedGradingTypeVal}"`
  611 |     ).toHaveAttribute('value', expectedGradingTypeVal, { timeout: TIMEOUTS.MEDIUM });
  612 |   }
  613 | 
  614 |   async assertColumnDetailWeight(col: ColumnConfig): Promise<void> {
  615 |     if (col.weight !== '') {
  616 |       this.logger.step(`  Assert weight = "${col.weight}"`);
  617 |       await this.highlightField(this.columnDetailPage.weightValue());
  618 |       await expect(
  619 |         this.columnDetailPage.weightValue(),
  620 |         `weight phải là "${col.weight}"`
  621 |       ).toHaveValue(col.weight, { timeout: TIMEOUTS.MEDIUM });
  622 |     }
  623 |   }
  624 | 
  625 |   async assertColumnDetailScheme(col: ColumnConfig): Promise<void> {
  626 |     if (col.scheme) {
  627 |       await this.assertColumnSubGradingItemDetail(col);
  628 |     }
  629 |   }
  630 | 
  631 |   async assertColumnDetailGradingInput(col: ColumnConfig): Promise<void> {
  632 |     if (col.gradingInput.isReadOnly) {
  633 |       this.logger.step('  Assert gradingInput = ReadOnly (read-only display)');
  634 |       const readOnlyEl = this.columnDetailPage.gradingInputReadOnlyCheckbox();
  635 |       await this.highlightField(readOnlyEl);
  636 |       await expect(
  637 |         readOnlyEl,
  638 |         'gradingInput: ReadOnly checkbox phải visible và checked'
  639 |       ).toHaveClass(/dx-checkbox-checked/, { timeout: TIMEOUTS.MEDIUM });
  640 |     } else if (col.isComment) {
  641 |       await this.assertDxCheckbox(
  642 |         this.columnDetailPage.isInputOrImportExcelCheckbox(),
  643 |         col.gradingInput.isInputOrImportExcel,
  644 |         'isInputOrImportExcel'
  645 |       );
  646 |     } else {
  647 |       await this.assertDxCheckbox(
  648 |         this.columnDetailPage.isInputOrImportExcelCheckbox(),
  649 |         col.gradingInput.isInputOrImportExcel,
  650 |         'isInputOrImportExcel'
  651 |       );
  652 |       await this.assertDxCheckbox(
  653 |         this.columnDetailPage.isFromTeacherGradebookCheckbox(),
  654 |         col.gradingInput.isFromTeacherGradebook,
  655 |         'isFromTeacherGradebook'
  656 |       );
  657 |     }
  658 |   }
  659 | 
  660 |   async assertColumnDetailGradingMechanism(col: ColumnConfig): Promise<void> {
  661 |     if (col.gradingMechanism !== '') {
  662 |       this.logger.step(`  Assert gradingMechanism = "${col.gradingMechanism}"`);
  663 |       await this.highlightField(this.columnDetailPage.gradingMechanismValue());
  664 |       await expect(
  665 |         this.columnDetailPage.gradingMechanismValue(),
  666 |         `gradingMechanism phải là "${col.gradingMechanism}"`
> 667 |       ).toHaveValue(col.gradingMechanism, { timeout: TIMEOUTS.MEDIUM });
      |         ^ Error: gradingMechanism phải là "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học"
  668 |     }
  669 |   }
  670 | 
  671 |   async assertColumnDetailIsRounded(col: ColumnConfig): Promise<void> {
  672 |     if (col.isRounded !== undefined) {
  673 |       await this.assertDxSwitch(
  674 |         this.columnDetailPage.isRoundedCheckbox(),
  675 |         col.isRounded,
  676 |         'isRounded'
  677 |       );
  678 |     }
  679 |   }
  680 | 
  681 |   async assertColumnDetailIsDisplayOnTotalScoreGradeBook(col: ColumnConfig): Promise<void> {
  682 |     if (col.isDisplayOnTotalScoreGradeBook !== undefined) {
  683 |       await this.assertDxCheckbox(
  684 |         this.columnDetailPage.isDisplayOnTotalScoreGradeBookCheckbox(),
  685 |         col.isDisplayOnTotalScoreGradeBook,
  686 |         'isDisplayOnTotalScoreGradeBook'
  687 |       );
  688 |     }
  689 |   }
  690 | 
  691 |   async assertColumnDetailIsSyncToCanvas(col: ColumnConfig): Promise<void> {
  692 |     if (col.isSyncToCanvas !== undefined) {
  693 |       await this.assertDxCheckbox(
  694 |         this.columnDetailPage.isSyncToCanvasCheckbox('Is sync'),
  695 |         col.isSyncToCanvas,
  696 |         'isSyncToCanvas'
  697 |       );
  698 |     }
  699 |   }
  700 | 
  701 |   async assertColumnDetailLineNumber(col: ColumnConfig): Promise<void> {
  702 |     this.logger.step(`  Assert lineNumber = "${col.lineNumber === '' ? 'empty' : col.lineNumber}"`);
  703 |     const lineNumberInput = this.columnDetailPage.lineNumberInput();
  704 |     await this.highlightField(lineNumberInput);
  705 |     if (col.lineNumber === '') {
  706 |       await expect(async () => {
  707 |         const text = (await lineNumberInput.inputValue()).trim();
  708 |         expect(text).toBe('');
  709 |       }).toPass({ timeout: TIMEOUTS.MEDIUM });
  710 |     } else {
  711 |       await expect(
  712 |         lineNumberInput,
  713 |         `lineNumber phải là "${col.lineNumber}"`
  714 |       ).toHaveValue(col.lineNumber, { timeout: TIMEOUTS.MEDIUM });
  715 |     }
  716 |   }
  717 | 
  718 |   async assertColumnDetailAllFields(col: ColumnConfig): Promise<void> {
  719 |     this.logger.step(`Assert toàn bộ fields chi tiết cột "${col.code}"`);
  720 |     await this.assertColumnDetailSemester(col);
  721 |     await this.assertColumnDetailParent(col);
  722 |     await this.assertColumnDetailCode(col);
  723 |     await this.assertColumnDetailName(col);
  724 |     await this.assertColumnDetailReportName(col);
  725 |     await this.assertColumnDetailGradingType(col);
  726 |     await this.assertColumnDetailWeight(col);
  727 |     await this.assertColumnDetailScheme(col);
  728 |     await this.assertColumnDetailGradingInput(col);
  729 |     await this.assertColumnDetailGradingMechanism(col);
  730 |     await this.assertColumnDetailIsRounded(col);
  731 |     await this.assertColumnDetailIsDisplayOnTotalScoreGradeBook(col);
  732 |     await this.assertColumnDetailIsSyncToCanvas(col);
  733 |     await this.assertColumnDetailLineNumber(col);
  734 |     await this.clearFieldHighlight();
  735 |   }
  736 | 
  737 |   /**
  738 |    * Duyệt qua tất cả cột trong template, mở trang chi tiết từng cột,
  739 |    * assert đầy đủ các fields rồi quay lại danh sách.
  740 |    *
  741 |    * Thay thế cho phiên bản cũ vốn chỉ check cột Calculation qua subGradingItemSchemes.
  742 |    * Phiên bản mới đọc toàn bộ config từ col.scheme (embedded) theo constants mới.
  743 |    */
  744 |   async assertColumnDetailByCode(detail: GradingBookTemplateDetail, colCode: string): Promise<void> {
  745 |     const col = detail.columns.find(c => c.code === colCode);
  746 |     if (!col) throw new Error(`Column "${colCode}" not found in template "${detail.code}"`);
  747 |     this.logger.step(`Assert chi tiết cột "${colCode}" của sổ điểm "${detail.code}"`);
  748 |     await this.scrollRowIntoView(col.code);
  749 |     await this.openColumnDetail(col.code);
  750 |     await expect(this.columnDetailPage.codeValue()).not.toHaveValue('', { timeout: TIMEOUTS.LONG });
  751 |     await this.assertColumnDetailAllFields(col);
  752 |     await this.closeColumnDetail();
  753 |   }
  754 | 
  755 |   async assertAllSubGradingItemDetails(detail: GradingBookTemplateDetail): Promise<void> {
  756 |     const cols = detail.columns;
  757 |     this.logger.step(`Assert chi tiết ${cols.length} cột của sổ điểm "${detail.code}"`);
  758 | 
  759 |     for (let i = 0; i < cols.length; i++) {
  760 |       const col = cols[i];
  761 |       this.logger.step(`--- [${i + 1}/${cols.length}] Chi tiết cột: ${col.code} ---`);
  762 |       await this.scrollRowIntoView(col.code);
  763 |       await this.openColumnDetail(col.code);
  764 |       await expect(this.columnDetailPage.codeValue()).not.toHaveValue('', { timeout: TIMEOUTS.LONG });
  765 |       await this.assertColumnDetailAllFields(col);
  766 |       await this.closeColumnDetail();
  767 |     }
```