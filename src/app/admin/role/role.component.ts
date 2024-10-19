import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { convertToUppercase, HideModal, ShowModal, Toast } from '../../../providers/common-service/common.service';
import { ResponseModel } from '../../../auth/jwtService';
import { CoreHttpService } from '../../../providers/AjaxServices/core-http.service';
import { LayoutComponent } from '../../layout/layout/layout.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [BreadcrumsComponent, ReactiveFormsModule, FormsModule, CommonModule, NgbDropdownModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {
  rolesForm: FormGroup;
  profileURL: string = "assets/images/faces/face.jpg";
  isRolesLoaded: boolean = false;
  Menu: Array<any> = [];
  roleMenuForm: FormGroup;
  menuItems: FormArray;
  RoleName: number = 0;
  PermissionValue: number = 0;
  Roles: Array<any> = [];
  addRoleForm: FormGroup;
  isLoading: boolean = false;
  ispermissionAdding: boolean = false;
  submitted: boolean = false;
  isPageReady: boolean = false;

  constructor(private fb: FormBuilder,
              private http: CoreHttpService,
              private layout: LayoutComponent) { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.isRolesLoaded = false;
    this.http.get("roles/getRoles").then((response: ResponseModel) => {
      if (response.ResponseBody) {
        this.Roles = response.ResponseBody;
      }
    })
    this.initForm(0, []);
    this.Roleform();
    this.PermissionValue = 0;
    this.layout.stopSkeleton();
  }

  pageReload() {
    this.initData();
  }

  getPermessionName(permissionValue: number) {
    this.PermissionValue = permissionValue;
    switch(permissionValue) {
      case 1:
        return "Grant full access.";
      case 2:
        return "Read only permission.";
      case 3:
        return "Read & Write permission.";
      default:
        return "Pick one access type.";
    }
  }

  buildForm(menu: Array<any>) {
    let itemArray: FormArray = this.fb.array([]);
    let i = 0;
    while(i < menu.length) {
      if(menu[i].childs != null) {
        if(menu[i].permission == null)
          menu[i].permission = 0;
        itemArray.push(this.fb.group({
          icon: new FormControl(menu[i].icon),
          catagory: new FormControl(menu[i].catagory),
          permission: new FormControl(menu[i].permission),
          accessCode: new FormControl(menu[i].accessCode),
          parentMenu: new FormControl(menu[i].childs)
        }));
      }
      i++;
    }
    return itemArray;
  }

  initForm(accessValue: number, menu: Array<any>) {
    this.rolesForm = this.fb.group({
      accessLevel: new FormControl(Number(accessValue)),
      menuItems: this.buildForm(menu)
    });
  }

  loadMenu(e: any) {
    this.isPageReady = false;
    this.isRolesLoaded = true;
    this.layout.startSkeleton();
    this.Menu = [];
    let accessLevelId = Number(e.target.value);
    if (accessLevelId > 0) {
      this.http.get(`roles/getMenu/${accessLevelId}`).then((response:ResponseModel) => {
        if (response.ResponseBody != null) {
          let menu = response.ResponseBody;
          let parentItems = menu.filter(x => x.childs == null);
          if (parentItems.length > 0) {
            let i = 0;
            while(i < parentItems.length) {
              this.Menu.push({
                name: parentItems[i].catagory,
                accessCode: parentItems[i].accessCode,
                parentDetail: parentItems[i],
                value: menu.filter (x => x.childs == parentItems[i].catagory)
              });
              i++;
            }

            this.initForm(accessLevelId, menu);
            this.isPageReady = true;
            this.layout.stopSkeleton();
          }
        }
      })
    }
  }

  selectPermission(i: any, position: number) {
    let items = this.rolesForm.controls["menuItems"] as FormArray;
    let elem: FormGroup = items.controls[position] as FormGroup;
    if(elem) {
      elem.get("permission").setValue(i);
    }
  }

  addRootCatagory(items: Array<any>) {
    this.Menu.map(item => {
      items.push({
        icon: '',
        catagory: item.Name,
        permission: 1,
        accessCode: item.accessCode,
        parentMenu: null
      });
    });
  }

  submitRole() {
    this.ispermissionAdding = true;
    let RolesAndMenu = {};
    let items = this.rolesForm.controls["menuItems"] as FormArray;
    let access = this.rolesForm.controls['accessLevel'] as FormControl;

    this.addRootCatagory(items.value);
    RolesAndMenu = {
      accessLevelId: access.value,
      menu: items.value
    };

    this.http.post("roles/addUpdatePermission", RolesAndMenu).then((response: ResponseModel) => {
      if (response.ResponseBody) {
        Toast("Permission added or updated successfully");
      }
      this.ispermissionAdding = false;
    });
  }

  Roleform() {
    this.addRoleForm = this.fb.group({
      roleName: new FormControl('', Validators.required),
      accessCodeDefination: new FormControl('', Validators.required)
    })
  }

  openCloseTab(e: any, i: number) {
    let target = e.target;
    let id = 'collapseExample'+i.toString();
    let value = document.getElementById(id).classList;
    if (value.contains('d-none')) {
      value.remove('d-none');
      target.lastChild.classList.remove('fa-caret-down', 'collapsing');
      target.lastChild.classList.add('fa-caret-up');
    }
    else {
      value.add('d-none');
      target.lastChild.classList.add('fa-caret-down');
      target.lastChild.classList.remove('fa-caret-up');
    }
  }

  addRolePopUp() {
    this.Roleform();
    ShowModal("addRole");
  }

  CloseFolderPopup() {
    HideModal("addRole");
  }

  get f() {
    return this.addRoleForm.controls;
  }

  AddRole() {
    this.isLoading = true;
    this.submitted = true;
    if (this.addRoleForm.invalid){
      this.isLoading = false;
      return;
    }

    let formValue = this.addRoleForm.value;
    if (formValue) {
      this.http.post("roles/addRole", formValue).then((response: ResponseModel) => {
        if (response.ResponseBody) {
          Toast("Role added successfully");
          this.Roles = response.ResponseBody;
          HideModal("addRole");
        }
        this.isLoading = false;
      }).catch(e => {
        this.isLoading = false;
      });
      this.submitted = false;
    };
  }

  inputToUppercase(event: Event) {
    convertToUppercase(event)
  }
}
