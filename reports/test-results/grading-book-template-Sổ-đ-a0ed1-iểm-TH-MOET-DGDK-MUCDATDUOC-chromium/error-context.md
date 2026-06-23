# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: grading-book-template.test.ts >> Sổ điểm mẫu - Subject Grading Book Templates >> TC_SGBT_007 - Kiểm tra chi tiết từng cột của sổ điểm TH_MOET_DGDK_MUCDATDUOC
- Location: tests\grading-book-template.test.ts:120:7

# Error details

```
Error: gradingMechanism phải là "10"

expect(locator).toHaveValue(expected) failed

Locator: locator('dx-select-box[itemtemplate="item"] .dx-texteditor-input').first()
Expected: "10"
Timeout: 15000ms
Error: element(s) not found

Call log:
  - gradingMechanism phải là "10" with timeout 15000ms
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
                    - textbox [ref=e285]: TH_MOET_DGDK_MUCDATDUOC
                - group [ref=e290]:
                  - generic [ref=e297]:
                    - generic [ref=e299]: "Name: *"
                    - 'textbox "Name: *" [ref=e304]': Sổ điểm MOET - Tiểu học - Đánh giá định kỳ & Mức đạt được
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
          - heading "Grade items - Sổ điểm MOET - Tiểu học - Đánh giá định kỳ & Mức đạt được" [level=5] [ref=e339]
          - group "Tree list with 16 rows and 9 columns" [ref=e340]:
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
              - row "GK1 0 10 HK1 Normal " [level=3] [ref=e380]:
                - gridcell "GK1" [ref=e381]:
                  - generic [ref=e382]: GK1
                - gridcell "0" [ref=e383]:
                  - generic [ref=e384]: "0"
                - gridcell "10" [ref=e385]
                - gridcell "HK1" [ref=e386]
                - gridcell "Normal" [ref=e387]
                - gridcell [ref=e388]:
                  - checkbox [ref=e389]
                - gridcell "" [ref=e392]:
                  - checkbox "" [checked] [ref=e393]:
                    - generic [ref=e395]: 
                - gridcell [ref=e396]
              - row "MDDGK1 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK1 Normal " [level=3] [ref=e397]:
                - gridcell "MDDGK1" [ref=e398]:
                  - generic [ref=e399]: MDDGK1
                - gridcell "0" [ref=e400]:
                  - generic [ref=e401]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e402]
                - gridcell "HK1" [ref=e403]
                - gridcell "Normal" [ref=e404]
                - gridcell [ref=e405]:
                  - checkbox [ref=e406]
                - gridcell "" [ref=e409]:
                  - checkbox "" [checked] [ref=e410]:
                    - generic [ref=e412]: 
                - gridcell [ref=e413]
              - row "NXGK1 HK1 Comment" [level=3] [ref=e414]:
                - gridcell "NXGK1" [ref=e415]:
                  - generic [ref=e416]: NXGK1
                - gridcell [ref=e417]
                - gridcell [ref=e418]
                - gridcell "HK1" [ref=e419]
                - gridcell "Comment" [ref=e420]
                - gridcell [ref=e421]:
                  - checkbox [ref=e422]
                - gridcell [ref=e425]:
                  - checkbox [ref=e426]
                - gridcell [ref=e429]
              - row "CK1 0 10 HK1 Normal " [level=3] [ref=e430]:
                - gridcell "CK1" [ref=e431]:
                  - generic [ref=e432]: CK1
                - gridcell "0" [ref=e433]:
                  - generic [ref=e434]: "0"
                - gridcell "10" [ref=e435]
                - gridcell "HK1" [ref=e436]
                - gridcell "Normal" [ref=e437]
                - gridcell [ref=e438]:
                  - checkbox [ref=e439]
                - gridcell "" [ref=e442]:
                  - checkbox "" [checked] [ref=e443]:
                    - generic [ref=e445]: 
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
              - row "HK2 0 10 HK2 Calculation" [expanded] [level=2] [ref=e480]:
                - gridcell "HK2" [ref=e481]:
                  - generic [ref=e482]: HK2
                - gridcell "0" [ref=e483]:
                  - generic [ref=e484]: "0"
                - gridcell "10" [ref=e485]
                - gridcell "HK2" [ref=e486]
                - gridcell "Calculation" [ref=e487]
                - gridcell [ref=e488]:
                  - checkbox [ref=e489]
                - gridcell [ref=e492]:
                  - checkbox [ref=e493]
                - gridcell [ref=e496]
              - row "GK2 0 10 HK2 Normal " [level=3] [ref=e497]:
                - gridcell "GK2" [ref=e498]:
                  - generic [ref=e499]: GK2
                - gridcell "0" [ref=e500]:
                  - generic [ref=e501]: "0"
                - gridcell "10" [ref=e502]
                - gridcell "HK2" [ref=e503]
                - gridcell "Normal" [ref=e504]
                - gridcell [ref=e505]:
                  - checkbox [ref=e506]
                - gridcell "" [ref=e509]:
                  - checkbox "" [checked] [ref=e510]:
                    - generic [ref=e512]: 
                - gridcell [ref=e513]
              - row "MDDGK2 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK2 Normal " [level=3] [ref=e514]:
                - gridcell "MDDGK2" [ref=e515]:
                  - generic [ref=e516]: MDDGK2
                - gridcell "0" [ref=e517]:
                  - generic [ref=e518]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e519]
                - gridcell "HK2" [ref=e520]
                - gridcell "Normal" [ref=e521]
                - gridcell [ref=e522]:
                  - checkbox [ref=e523]
                - gridcell "" [ref=e526]:
                  - checkbox "" [checked] [ref=e527]:
                    - generic [ref=e529]: 
                - gridcell [ref=e530]
              - row "NXGK2 HK2 Comment" [level=3] [ref=e531]:
                - gridcell "NXGK2" [ref=e532]:
                  - generic [ref=e533]: NXGK2
                - gridcell [ref=e534]
                - gridcell [ref=e535]
                - gridcell "HK2" [ref=e536]
                - gridcell "Comment" [ref=e537]
                - gridcell [ref=e538]:
                  - checkbox [ref=e539]
                - gridcell [ref=e542]:
                  - checkbox [ref=e543]
                - gridcell [ref=e546]
              - row "CK2 0 10 HK2 Normal " [level=3] [ref=e547]:
                - gridcell "CK2" [ref=e548]:
                  - generic [ref=e549]: CK2
                - gridcell "0" [ref=e550]:
                  - generic [ref=e551]: "0"
                - gridcell "10" [ref=e552]
                - gridcell "HK2" [ref=e553]
                - gridcell "Normal" [ref=e554]
                - gridcell [ref=e555]:
                  - checkbox [ref=e556]
                - gridcell "" [ref=e559]:
                  - checkbox "" [checked] [ref=e560]:
                    - generic [ref=e562]: 
                - gridcell [ref=e563]
              - row "MDDCK2 0 TH - Đánh giá môn học & hoạt động giáo dục Tiểu học HK2 Normal " [level=3] [ref=e564]:
                - gridcell "MDDCK2" [ref=e565]:
                  - generic [ref=e566]: MDDCK2
                - gridcell "0" [ref=e567]:
                  - generic [ref=e568]: "0"
                - gridcell "TH - Đánh giá môn học & hoạt động giáo dục Tiểu học" [ref=e569]
                - gridcell "HK2" [ref=e570]
                - gridcell "Normal" [ref=e571]
                - gridcell [ref=e572]:
                  - checkbox [ref=e573]
                - gridcell "" [ref=e576]:
                  - checkbox "" [checked] [ref=e577]:
                    - generic [ref=e579]: 
                - gridcell [ref=e580]
              - row "NXCK2 HK2 Comment" [level=3] [ref=e581]:
                - gridcell "NXCK2" [ref=e582]:
                  - generic [ref=e583]: NXCK2
                - gridcell [ref=e584]
                - gridcell [ref=e585]
                - gridcell "HK2" [ref=e586]
                - gridcell "Comment" [ref=e587]
                - gridcell [ref=e588]:
                  - checkbox [ref=e589]
                - gridcell [ref=e592]:
                  - checkbox [ref=e593]
                - gridcell [ref=e596]
              - row "TL 0 10 Normal" [level=1] [ref=e597]:
                - gridcell "TL" [ref=e598]:
                  - generic [ref=e599]: TL
                - gridcell "0" [ref=e600]:
                  - generic [ref=e601]: "0"
                - gridcell "10" [ref=e602]
                - gridcell [ref=e603]
                - gridcell "Normal" [ref=e604]
                - gridcell [ref=e605]:
                  - checkbox [ref=e606]
                - gridcell [ref=e609]:
                  - checkbox [ref=e610]
                - gridcell [ref=e613]
            - treegrid:
              - row "Giữa kỳ 1  " [level=3]:
                - gridcell "Giữa kỳ 1  " [ref=e617]:
                  - generic [ref=e623]:
                    - generic [ref=e624]: Giữa kỳ 1
                    - generic [ref=e626]:
                      - generic [ref=e629] [cursor=pointer]: 
                      - img [ref=e632] [cursor=pointer]
                      - generic [ref=e638] [cursor=pointer]: 
              - row "Mức đạt được - GK1  " [level=3]:
                - gridcell "Mức đạt được - GK1  " [ref=e639]:
                  - generic [ref=e645]:
                    - generic [ref=e646]: Mức đạt được - GK1
                    - generic [ref=e648]:
                      - generic [ref=e651] [cursor=pointer]: 
                      - img [ref=e654] [cursor=pointer]
                      - generic [ref=e660] [cursor=pointer]: 
              - row "Nhận xét giữa kì 1  " [level=3]:
                - gridcell "Nhận xét giữa kì 1  " [ref=e661]:
                  - generic [ref=e667]:
                    - generic [ref=e668]: Nhận xét giữa kì 1
                    - generic [ref=e670]:
                      - generic [ref=e673] [cursor=pointer]: 
                      - img [ref=e676] [cursor=pointer]
                      - generic [ref=e682] [cursor=pointer]: 
              - row "Cuối kỳ 1  " [level=3]:
                - gridcell "Cuối kỳ 1  " [ref=e683]:
                  - generic [ref=e689]:
                    - generic [ref=e690]: Cuối kỳ 1
                    - generic [ref=e692]:
                      - generic [ref=e695] [cursor=pointer]: 
                      - img [ref=e698] [cursor=pointer]
                      - generic [ref=e704] [cursor=pointer]: 
              - row "Mức đạt được - CK1  " [level=3]:
                - gridcell "Mức đạt được - CK1  " [ref=e705]:
                  - generic [ref=e711]:
                    - generic [ref=e712]: Mức đạt được - CK1
                    - generic [ref=e714]:
                      - generic [ref=e717] [cursor=pointer]: 
                      - img [ref=e720] [cursor=pointer]
                      - generic [ref=e726] [cursor=pointer]: 
              - row "Nhận xét cuối kì 1  " [level=3]:
                - gridcell "Nhận xét cuối kì 1  " [ref=e727]:
                  - generic [ref=e733]:
                    - generic [ref=e734]: Nhận xét cuối kì 1
                    - generic [ref=e736]:
                      - generic [ref=e739] [cursor=pointer]: 
                      - img [ref=e742] [cursor=pointer]
                      - generic [ref=e748] [cursor=pointer]: 
              - row " Học kỳ 2  " [expanded] [level=2]:
                - gridcell " Học kỳ 2  " [ref=e749]:
                  - generic [ref=e752]:
                    - generic: 
                  - generic [ref=e754]:
                    - generic [ref=e755]: Học kỳ 2
                    - generic [ref=e757]:
                      - generic [ref=e760] [cursor=pointer]: 
                      - img [ref=e763] [cursor=pointer]
                      - generic [ref=e769] [cursor=pointer]: 
              - row "Giữa kỳ 2  " [level=3]:
                - gridcell "Giữa kỳ 2  " [ref=e770]:
                  - generic [ref=e776]:
                    - generic [ref=e777]: Giữa kỳ 2
                    - generic [ref=e779]:
                      - generic [ref=e782] [cursor=pointer]: 
                      - img [ref=e785] [cursor=pointer]
                      - generic [ref=e791] [cursor=pointer]: 
              - row "Mức đạt được - GK2  " [level=3]:
                - gridcell "Mức đạt được - GK2  " [ref=e792]:
                  - generic [ref=e798]:
                    - generic [ref=e799]: Mức đạt được - GK2
                    - generic [ref=e801]:
                      - generic [ref=e804] [cursor=pointer]: 
                      - img [ref=e807] [cursor=pointer]
                      - generic [ref=e813] [cursor=pointer]: 
              - row "Nhận xét giữa kì 2  " [level=3]:
                - gridcell "Nhận xét giữa kì 2  " [ref=e814]:
                  - generic [ref=e820]:
                    - generic [ref=e821]: Nhận xét giữa kì 2
                    - generic [ref=e823]:
                      - generic [ref=e826] [cursor=pointer]: 
                      - img [ref=e829] [cursor=pointer]
                      - generic [ref=e835] [cursor=pointer]: 
              - row "Cuối kỳ 2  " [level=3]:
                - gridcell "Cuối kỳ 2  " [ref=e836]:
                  - generic [ref=e842]:
                    - generic [ref=e843]: Cuối kỳ 2
                    - generic [ref=e845]:
                      - generic [ref=e848] [cursor=pointer]: 
                      - img [ref=e851] [cursor=pointer]
                      - generic [ref=e857] [cursor=pointer]: 
              - row "Mức đạt được - CK2  " [level=3]:
                - gridcell "Mức đạt được - CK2  " [ref=e858]:
                  - generic [ref=e864]:
                    - generic [ref=e865]: Mức đạt được - CK2
                    - generic [ref=e867]:
                      - generic [ref=e870] [cursor=pointer]: 
                      - img [ref=e873] [cursor=pointer]
                      - generic [ref=e879] [cursor=pointer]: 
              - row "Nhận xét cuối kì 2  " [level=3]:
                - gridcell "Nhận xét cuối kì 2  " [ref=e880]:
                  - generic [ref=e886]:
                    - generic [ref=e887]: Nhận xét cuối kì 2
                    - generic [ref=e889]:
                      - generic [ref=e892] [cursor=pointer]: 
                      - img [ref=e895] [cursor=pointer]
                      - generic [ref=e901] [cursor=pointer]: 
              - row "Thi lại  " [level=1]:
                - gridcell "Thi lại  " [ref=e902]:
                  - generic [ref=e906]:
                    - generic [ref=e907]: Thi lại
                    - generic [ref=e909]:
                      - generic [ref=e912] [cursor=pointer]: 
                      - img [ref=e915] [cursor=pointer]
                      - generic [ref=e921] [cursor=pointer]: 
  - dialog "Grade item - Update" [active] [ref=e923]:
    - toolbar [ref=e924]:
      - generic [ref=e928]: Grade item - Update
    - generic [ref=e931]:
      - form [ref=e934]:
        - group [ref=e942]:
          - generic [ref=e946]:
            - group [ref=e951]:
              - generic [ref=e955]:
                - generic [ref=e961]:
                  - generic [ref=e962]: 
                  - text: General infor 
                - generic [ref=e964]:
                  - group [ref=e969]:
                    - generic [ref=e973]:
                      - generic [ref=e976]:
                        - generic [ref=e978]: "Semester:"
                        - generic [ref=e982] [cursor=pointer]:
                          - generic [ref=e983]:
                            - combobox "Select..." [ref=e984]
                            - generic: Select...
                          - generic [ref=e985]:
                            - text: 
                            - button "Select" [ref=e986]:
                              - generic [ref=e988]: 
                      - generic [ref=e991]:
                        - generic [ref=e993]: "Grade item code: *"
                        - 'textbox "Grade item code: *" [ref=e998]': TL
                      - generic [ref=e1001]:
                        - generic [ref=e1003]: "Report name:"
                        - textbox "Report name:" [ref=e1008]
                  - group [ref=e1013]:
                    - generic [ref=e1017]:
                      - generic [ref=e1020]:
                        - generic [ref=e1022]: "Parent:"
                        - generic [ref=e1023]:
                          - generic:
                            - generic:
                              - generic:
                                - generic:
                                  - combobox "Select..." [disabled]
                                  - generic: Select...
                                - generic:
                                  - button "Select":
                                    - generic:
                                      - generic: 
                      - generic [ref=e1026]:
                        - generic [ref=e1028]: "Grade item name: *"
                        - 'textbox "Grade item name: *" [ref=e1033]': Thi lại
            - group [ref=e1038]:
              - generic [ref=e1042]:
                - generic [ref=e1048]:
                  - generic [ref=e1049]: 
                  - text: Formula and calculation
                - group [ref=e1054]:
                  - generic [ref=e1060]:
                    - generic [ref=e1063]:
                      - generic [ref=e1065]: "Grading type:"
                      - generic [ref=e1066]:
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
                    - generic [ref=e1069]:
                      - generic [ref=e1071]: "Weight: *"
                      - generic [ref=e1073]:
                        - spinbutton [ref=e1077]: "0"
                        - button "Score" [ref=e1078] [cursor=pointer]:
                          - generic [ref=e1081]:
                            - generic [ref=e1082]: "%"
                            - generic [ref=e1084]: Score
                - generic [ref=e1087]:
                  - generic:
                    - group
                - generic [ref=e1090]:
                  - generic:
                    - group
                - group [ref=e1095]:
                  - group [ref=e1104]:
                    - generic [ref=e1110]:
                      - generic [ref=e1113]:
                        - generic [ref=e1115]: "Input or excel import:"
                        - checkbox "" [checked] [ref=e1118] [cursor=pointer]:
                          - generic [ref=e1120]: 
                      - generic [ref=e1123]:
                        - generic [ref=e1125]: "Select from teacher gradebook:"
                        - checkbox "" [checked] [ref=e1128] [cursor=pointer]:
                          - generic [ref=e1130]: 
            - group [ref=e1137]:
              - generic [ref=e1141]:
                - generic [ref=e1147]:
                  - generic [ref=e1148]: 
                  - text: Display configuration
                - generic [ref=e1151]:
                  - generic:
                    - group
                - group [ref=e1156]:
                  - group [ref=e1165]:
                    - generic [ref=e1172]:
                      - generic [ref=e1174]: "Is rounded:"
                      - button "OFF" [ref=e1177] [cursor=pointer]:
                        - generic [ref=e1180]:
                          - generic [ref=e1181]: "ON"
                          - generic [ref=e1183]: "OFF"
                - group [ref=e1188]:
                  - generic [ref=e1194]:
                    - generic [ref=e1197]:
                      - generic [ref=e1199]: "Is display on total score gradebook:"
                      - checkbox "Is display on total score gradebook:" [ref=e1201] [cursor=pointer]
                    - generic [ref=e1206]:
                      - generic [ref=e1208]: "Line number:"
                      - spinbutton [ref=e1214]
                - group [ref=e1219]:
                  - generic [ref=e1226]:
                    - generic [ref=e1228]: "Is sync:"
                    - checkbox [ref=e1231] [cursor=pointer]
      - generic [ref=e1235]:
        - button "Save" [ref=e1236] [cursor=pointer]:
          - generic [ref=e1237]:
            - generic [ref=e1238]: 
            - generic [ref=e1239]: Save
        - button "Close" [ref=e1240] [cursor=pointer]:
          - generic [ref=e1242]: Close
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
      |         ^ Error: gradingMechanism phải là "10"
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
  744 |   async assertAllSubGradingItemDetails(detail: GradingBookTemplateDetail): Promise<void> {
  745 |     const cols = detail.columns;
  746 |     this.logger.step(`Assert chi tiết ${cols.length} cột của sổ điểm "${detail.code}"`);
  747 | 
  748 |     for (let i = 0; i < cols.length; i++) {
  749 |       const col = cols[i];
  750 |       this.logger.step(`--- [${i + 1}/${cols.length}] Chi tiết cột: ${col.code} ---`);
  751 |       await this.scrollRowIntoView(col.code);
  752 |       await this.openColumnDetail(col.code);
  753 |       // Chờ field code có value — đảm bảo form data đã load xong, không wait mù
  754 |       await expect(this.columnDetailPage.codeValue())
  755 |         .not.toHaveValue('', { timeout: TIMEOUTS.LONG });
  756 |       await this.assertColumnDetailAllFields(col);
  757 |       await this.closeColumnDetail();
  758 |     }
  759 |   }
  760 | }
  761 | 
```