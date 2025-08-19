import {Router} from "express"
import { 
    login,
    registerUser,
    logout,
    refreshAcessToken,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentUser,
    deleteUser,
    getAllUsers,
    updateUserRoleAndStatus,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login); 
router.route("/logout",verifyJWT).post(logout);
router.route("/refresh-access-token",verifyJWT).post(refreshAcessToken);
router.route("/change-password").patch(verifyJWT,changeCurrentPassword);
router.route("/update-account-details").patch(verifyJWT,updateAccountDetails);
router.route("/me").get(verifyJWT,getCurrentUser);

//admin only
router.route("/delete-user/:userId").delete(verifyJWT,  checkRole("admin"), deleteUser);
router.route("/get-all-users").get(verifyJWT,  checkRole("admin"), getAllUsers);
router.route("/update-role-status/:userId").patch(verifyJWT,  checkRole("admin"), updateUserRoleAndStatus);

export default router;