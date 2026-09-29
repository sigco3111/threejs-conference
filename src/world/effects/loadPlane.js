import { getGltfLoader } from "../loaders/createGltfLoaders.js";

export const PLANE_PATH = `${import.meta.env.BASE_URL}models/plane.glb`;

export async function loadPlaneModel(renderer) {
  const gltfLoader = getGltfLoader(renderer);
  const gltf = await gltfLoader.loadAsync(PLANE_PATH);
  return gltf.scene;
}
