import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AuthInitializer from "./AuthInitializer"


const container = document.getElementById("root");
createRoot(container).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <App />
      </AuthInitializer>  
    </Provider>
  </React.StrictMode>
);

// <Route index element={<HomePage />} />
// <Route path="login" element={<AuthLayout authentication={false}><LoginPage /></AuthLayout>} />
// <Route path="signup" element={<AuthLayout authentication={false}><SignupPage /></AuthLayout>} />

// {/* Product related */}
// <Route path="product/:id" element={<ProductDetailsPage />} />
// <Route path="cart" element={<CartPage />} />
// <Route path="checkout" element={<AuthLayout><CheckoutPage /></AuthLayout>} />

// {/* Measurement customization */}
// <Route path="measurement" element={<AuthLayout><MeasurementPage /></AuthLayout>} />

// {/* Tailor selection */}
// <Route path="select-tailor" element={<AuthLayout><TailorSelectionPage /></AuthLayout>} />

// {/* Orders & tracking */}
// <Route path="orders/track" element={<AuthLayout><OrderTrackingPage /></AuthLayout>} />

// {/* User profile */}
// <Route path="profile" element={<AuthLayout><ProfilePage /></AuthLayout>} />
