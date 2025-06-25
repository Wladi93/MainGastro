<template>
  <div>
    <q-card style="height: 0px">
      <q-card-section class="text-center">
        <h2>404 Unauthorized</h2>
        <q-separator size="2px" />
        <div class="flex flex-center" style="height: 200px">
          <q-icon name="error" size="150px" color="negative" />
        </div>
        <q-separator size="2px" />
      </q-card-section>
      <div
        style="
          display: flex;
          justify-content: center;
          justify-items: center;
          font-size: 16px;
        "
        class="text-caption q-mt-md"
      >
        <h5 class="text-caption text-center color-secondary">
          Bitte als Admin
          <RouterLink class="text-secondary" to="/login">
            <q-icon name="login" />
            einloggen</RouterLink
          >.
        </h5>
      </div>
    </q-card>
  </div>
</template>
