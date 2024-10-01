export const Login = "login";
export const BaseSubUrlPath = "bot";
export const Home = "home";
export const String = "string";
export const ProfileImage = "profile";

export const AccessTokenExpiredOn = "access_token_expired_on";
export const ProjectName = "axilcrops";
export const ServerError = 500;
export const ServerNotAvailable = 503;
export const BadRequest = 400;
export const Success = 200;
export const UnAuthorize = 401;
export const NotFound = 404;
export const Forbidden = 403;
export const AccessToken = ProjectName + "_access_token";
export const Authorization = "Authorization";
export const Master = ProjectName + "_master";
export const UserDetailName = ProjectName + "_UserDetail";

// ********************** Admin route pages  *******************

export const AdminBaseRoute = `${BaseSubUrlPath}/axil/admin`;
export const Dashboard = `${BaseSubUrlPath}/axil/administration/dashboard`;
export const InitialInvestment = `${BaseSubUrlPath}/axil/administration/initialinvestment`;
export const MasterData = `${BaseSubUrlPath}/axil/administration/masterdata`;
export const User = `${BaseSubUrlPath}/axil/administration/user`;
export const ManageUser = `${BaseSubUrlPath}/axil/administration/manageuser`;
export const UserInvestment = `${BaseSubUrlPath}/axil/administration/userInvestment`;

// ********************** Admin route pages  *******************

// *************************** file name constancts  *************
export const Doc = "doc";
export const Docx = "docx";
export const ADocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const Pdf = "pdf";
export const APdf = "application/pdf";
export const Txt = "txt";
export const FlatFile = "file";
export const Zip = "zip";
export const Excelx = "xlsx";
export const Excel = "xls";
export const Ppt = "ppt";
export const Pptx = "pptx";
export const Directory = "";
export const JImage = 'jpg';
export const PImage = 'png';
export const AImage = "jpeg";

export const DocImg = "assets/ext/doc.png";
export const PdfImg = "assets/ext/pdf.png";
export const TxtImg = "assets/ext/txt.png";
export const FlatFileImg = "assets/ext/file.png";
export const ExcelImg = "assets/img/ExcelFile.png";
export const PptImg = "assets/ext/ppt.jpg";
export const Images = "assets/ext/image.png";
export const DocumentPath = "ApplicationFiles";
export const UserPath = "User";
export const UserImage = "assets/images/face.jpg";
export const OrgLogo = "assets/images/organization-logo.jpg"

export const MaxAllowedFileSize = 2048

/*=================  API Service Names ========================*/

export enum SERVICE {
  AUTH = "oauth",
  CORE = "core"
}


export enum UserType {
  Admin = 1,
  Employee = 2,
  Candidate = 3,
  Client = 4,
  Other = 5,
  Compnay = 6
}

export enum ItemStatus
{
  NotSubmitted = 0,
  Completed = 1,
  Pending = 2,
  Canceled = 3,
  NotGenerated = 4,
  Rejected = 5,
  Generated = 6,
  Raised = 7,
  Submitted = 8,
  Approved = 9,
  Present = 10,
  Absent = 11,
  MissingAttendanceRequest = 12,
  Saved = 13,
  AutoPromoted = 14,
  FinalLevel = 15
}



