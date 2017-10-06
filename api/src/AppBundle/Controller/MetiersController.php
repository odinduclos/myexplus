<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use FOS\RestBundle\Controller\Annotations as Rest;
use AppBundle\Form\MetiersType;
use AppBundle\Entity\Metiers;

/**
 * Metier controller.
 */
class MetiersController extends Controller
{
    /**
     * Lists all metier entities.
     *
     * @Rest\View()
     * @Rest\Get("/metiers")
     * @Security("has_role(2) || has_role(3)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $metiers = $em->getRepository('AppBundle:Metiers')->findAll();

        return $metiers;
    }

    /**
     * Creates a new metier entity.
     *
     * @Rest\View(statusCode=Response::HTTP_CREATED)
     * @Rest\Post("/metiers/new")
     * @Security("has_role(2) || has_role(3)")
     */
    public function newAction(Request $request)
    {

        $path = $this->get('kernel')->getRootDir() . "/../web/pictures";

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $output_file = $request->get('titre');
        $base64_string = $request->get('photo_path');
        $ifp = fopen($output_file, "wb");
        $data = explode(',', $base64_string);
        $pos  = strpos($base64_string, ';');
        $mime_type = explode(':', substr($base64_string, 0, $pos))[1];
        $mime_type = explode('/', $mime_type);
        $mime_type = '.' . $mime_type[1];
        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        $metiers = new Metiers();

        $metiers->setTitre($request->get('titre'))
        ->setPhotoPath("http://" . $_SERVER['HTTP_HOST'] . "/pictures/" . $request->get('titre') . $mime_type)
        ->setDefinition($request->get('definition'));

        if ($metiers->getTitre() == null || $metiers->getdefinition() == null || $metiers->getPhotoPath() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }

        $file = file_get_contents($output_file);
        file_put_contents($path . "/" . $request->get('titre') . $mime_type, $file);
        unlink($output_file);

        $em = $this->get('doctrine.orm.entity_manager');
        $em->persist($metiers);
        $em->flush();

        return $metiers;
    }

    /**
     * Finds and displays a metier entity.
     *
     * @Rest\View()
     * @Rest\Get("/metiers/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $metiers = $em->getRepository('AppBundle:Metiers')->find($id);

        return $metiers;
    }

    /**
     * @Rest\View()
     * @Rest\Patch("/metiers/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function patchMetiersAction(Request $request)
    {
        return $this->updateMetiers($request);
    }

    public function updateMetiers(Request $request)
    {
        $metiers = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:Metiers')
        ->find($request->get('id'));

        if (empty($metiers)) {
            return new JsonResponse(['message_err' => "Le métier est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(MetiersType::class, $metiers);
	if (isset($request->get('photoPath'))) {
        	$path = $this->get('kernel')->getRootDir() . "/../web/pictures";
        	$output_file = $request->get('titre');
        	$base64_string = $request->get('photoPath');
        	$ifp = fopen($output_file, "wb");
        	$data = explode(',', $base64_string);
        	$pos  = strpos($base64_string, ';');
        	$mime_type = explode(':', substr($base64_string, 0, $pos))[1];
        	$mime_type = explode('/', $mime_type);
        	$mime_type = '.' . $mime_type[1];
        	fwrite($ifp, base64_decode($data[1]));
        	fclose($ifp);

       		$photo = "http://" . $_SERVER['HTTP_HOST'] . "/pictures/" . $request->get('titre') . $mime_type;
        	$file = file_get_contents($output_file);
        	file_put_contents($path . "/" . $request->get('titre') . $mime_type, $file);
        	unlink($output_file);
        	$form->get('photoPath')->setData($photo);
	}

        $form->submit($request->request->all(), false);

        if ($form->isValid()) {

            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($metiers);
            $em->flush();
            return $metiers;
        } else {
            return $form;
        }
    }

    /**
     * Deletes a metier entity.
     *
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/metiers/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function deleteAction(Request $request, Metiers $metier)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $metiers = $em->getRepository('AppBundle:Metiers')
        ->find($request->get('id'));

        if ($metiers) {
            $em->remove($metiers);
            $em->flush();
            return new JsonResponse(["message" => "Le métier a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "Le métier est introuvable !"]);
    }
}
